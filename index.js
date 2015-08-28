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
                    '  self.postMessage(node.getAttribute("id"));' +
                    '});',
    onMessage: function (node) {
        panel.show();
        panel.port.emit("subscriptionstatus", [ss.storage.subscriptionended, ss.storage.token]);
        clickedNode = node;
    }
});

panel.port.on("password-generated", function(password) {

    panel.hide();
    enterPassword(password);

});

panel.port.on("ajax-request", function(ajaxparams)
{

    var type = ajaxparams[0];
    var params = ajaxparams[1];

    switch (type)
    {
        case "token":
            exports.main = function() {
                var Request = require("request").Request;
                Request({
                    url: "https://www.cryptmate.com/processing/rest.php",
                    content: params,
                    onComplete: function (data) {
                        var returndata = JSON.parse(data);
                        switch (returndata.returntype)
                        {
                            case "error":
                                panel.port.emit("error");
                                break;
                            case "password":
                                panel.port.emit("ajax-return", returndata.hash);
                                break;
                        }
                    }
                }).post();
            };
            break;
        case "generate":
            exports.main = function() {
                var Request = require("request").Request;
                Request({
                    url: "https://www.cryptmate.com/processing/rest.php",
                    content: params,
                    onComplete: function (data) {
                        var returndata = JSON.parse(data);
                        switch (returndata.returntype)
                        {
                            case "error":
                                panel.port.emit("error");
                                break;
                            case "password":
                                enterPassword(returndata.hash);
                                panel.hide();
                                break;
                        }
                    }
                }).post();
            };
            break;
    }
});

panel.port.on("clear-token", function(){
    ss.storage.token = null;
});

function enterPassword(password)
{
    var tabs = require("sdk/tabs");
    var contentScriptString = 'document.getElementById("' + clickedNode + '").value = "' + password + '"';

    tabs.activeTab.attach({
        contentScript: contentScriptString
    });
}