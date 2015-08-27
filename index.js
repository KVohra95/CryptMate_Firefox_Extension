var self = require('sdk/self');

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

var self = require('sdk/self');

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

var generatedpassword = "";



var cm = require("sdk/context-menu");
cm.Item({
  label: "Insert Password",
  context: cm.SelectorContext("input[type=password], input[type=text]"),
  contentScript:  'self.on("click", function (node, data) {' +
  '  node.value = "' + generatedpassword + '";' +
  '});'
});