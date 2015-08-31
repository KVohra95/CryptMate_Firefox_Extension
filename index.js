var self = require('sdk/self');
var ss = require("sdk/simple-storage");
var cm = require("sdk/context-menu");

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

var clickedNode;

var panel = require("sdk/panel").Panel({
    contentURL: self.data.url("popup.html"),
    contentScriptFile: [self.data.url("jquery.js"), self.data.url("popup.js")],
    contentScriptWhen: "ready"
});

cm.Item({
    label: "Insert Password",
    context: cm.SelectorContext("input[type=password], input[type=text]"),
    contentScript:  'self.on("click", function (node, data) {' +
                    '  self.postMessage([node.getAttribute("id"), window.location.hostname]);' +
                    '});',
    onMessage: function (returndata) {
        panel.show();
        panel.port.emit("subscriptionstatus", [ss.storage.subscriptionended, ss.storage.token, returndata[1]]);
        clickedNode = returndata[0];
    }
});

panel.port.on("password-generated", function(password)
{
    panel.hide();

    var tabs = require("sdk/tabs");
    var contentScriptString = 'document.getElementById("' + clickedNode + '").value = "' + password + '"';

    tabs.activeTab.attach({
        contentScript: contentScriptString
    });
});

panel.port.on("remove", function(variable)
{

});