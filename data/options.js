$("form").on('submit', function (e)
{
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var params =
    {
        username: username,
        password: password
    };

    //connect to online php file and obtain token, decode and store using chrome.storage.sync.set

    $.ajax({
        type: "POST",
        url: "https://www.cryptmate.com/processing/rest.php",
        data: params,
        success: function(data, status){
            var returndata = JSON.parse(data);
            switch (returndata.returntype)
            {
                case "error":
                    error(returndata.error);
                    break;
                case "token":
                    self.port.emit("set", ["token", returndata.token]);
                    break;
                case "subscriptionended":
                    self.port.emit("set", ["subscriptionended", "true"]);
                    break;
            }
        },
        error: function(){}
    });

    return false;
});

function logout()
{
    self.port.emit("remove", "token");
}

document.getElementById("logout").onclick = logout;

$(document).ready(function() {
    chrome.storage.sync.get('token', function(data)
    {
        if (typeof data.token == 'undefined')
        {
            $("#logout").hide();
            $("#login").show();
        }
        else
        {
            $("#login").hide();
            $("#logout").show();
        }
    });
});