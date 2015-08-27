/**
 * Created by Kabeer.Vohra on 8/27/2015.
 */

document.getElementById("passwordform").on

function submit(elements)
{
    var textArea = document.getElementById("textbox");
    console.log(elements.serialize());
    console.log(textArea.value);
    self.port.emit("text-entered", textArea.value);
}