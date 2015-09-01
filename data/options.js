$("form").on('submit', function (e)
{
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var params =
    {
        username: username,
        password: password
    };

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
                    self.port.emit("set", ["token", '"' + returndata.token + '"']);
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

document.getElementById("logout").onclick = function() {  self.port.emit("remove", "token");  };

self.port.on("token", function(token) {
    if (token == null)
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