/**
 * Created by Kabeer.Vohra on 8/27/2015.
 */

//document.getElementById("passwordform").on()
//
//function submit(elements)
//{
//    var textArea = document.getElementById("textbox");
//    console.log(elements.serialize());
//    console.log(textArea.value);
//    self.port.emit("text-entered", textArea.value);
//}

var selectedNode;



self.port.on("node", function(node){
    selectedNode = node;
    console.log("node recieved");

    $("#passwordform").on('submit', function(){
        var textArea = document.getElementById("textbox");
        //console.log(elements.serialize());
        //console.log(textArea.value);
        //self.port.emit("text-entered", textArea.value);
        //node.value = textArea.value;
        console.log(node);
        console.log(node.value);
        console.log(textArea.value);
    });
});