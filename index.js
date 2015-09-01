var self = require('sdk/self');
var ss = require("sdk/simple-storage");
var cm = require("sdk/context-menu");
var sp = require("sdk/simple-prefs");
var pan = require("sdk/panel");

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

var clickedNode;

var passwordpanel = pan.Panel({
    contentURL: self.data.url("popup.html"),
    contentScriptFile: [self.data.url("jquery.js"), self.data.url("popup.js")],
    contentScriptWhen: "ready"
});

var loginpanel = pan.Panel({
    contentURL: self.data.url("options.html"),
    contentScriptFile: [self.data.url("jquery.js"), self.data.url("options.js")],
    contentScriptWhen: "ready"
});

cm.Item({
    label: "Insert Password",
    context: cm.SelectorContext("input[type=password], input[type=text]"),
    contentScript:  'self.on("click", function (node, data) {' +
                    '  self.postMessage([node.getAttribute("id"), window.location.hostname]);' +
                    '});',
    onMessage: function (returndata) {
        passwordpanel.show();
        passwordpanel.port.emit("subscriptionstatus", [ss.storage.subscriptionended, ss.storage.token, returndata[1]]);
        clickedNode = returndata[0];
    }
});

sp.on("credentials", function() {
    loginpanel.show();
    loginpanel.port.emit("token", ss.storage.token);
});

passwordpanel.port.on("password-generated", function(password)
{
    passwordpanel.hide();

    var tabs = require("sdk/tabs");
    var contentScriptString = 'document.getElementById("' + clickedNode + '").value = "' + password + '"';

    tabs.activeTab.attach({
        contentScript: contentScriptString
    });
});

passwordpanel.port.on("remove", function(variable)
{
    eval("ss.storage." + variable + " = null;");
});

loginpanel.port.on("set", function(varval){
    var variable = varval[0];
    var value = varval[1];
    eval("ss.storage." + variable + " = " + value + ";");
    loginpanel.port.emit("token", ss.storage.token);
});

loginpanel.port.on("remove", function(variable)
{
    eval("ss.storage." + variable + " = null;");
    loginpanel.port.emit("token", ss.storage.token);
});