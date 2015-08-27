var self = require('sdk/self');
var ss = require("sdk/simple-storage");
var cm = require("sdk/context-menu");

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

var generatedpassword = "";
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
                    //'  node.value = "' + generatedpassword + '";' +
                    //'   panel.show();' +
                    '  self.postMessage(node);' +
                    '});',
    onMessage: function (node) {
        panel.show();
        panel.port.emit("node", node);
    }
});
//
//self.port.on("node-recieved", function(node) {
//    console.log(node.value);
//});

panel.port.on("text-entered", function(message) {
    //console.log(ss.storage.node.value);
    //node.value = message;
});
