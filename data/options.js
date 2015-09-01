var username = $("#username");
var password = $("#password");
var loginform = $("#login");
var logoutbtn = $("#logout");
var errordiv = $("#error");

$("form").on('submit', function (e)
{

    var params =
    {
        username: username.val(),
        password: password.val()
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

logoutbtn.onclick = function() {  self.port.emit("remove", "token");  };

self.port.on("token", function(token) {
    if (token == null)
    {
        errordiv.hide();
        logoutbtn.hide();
        loginform.show();
    }
    else
    {
        errordiv.hide();
        loginform.hide();
        logoutbtn.show();
    }
});

function clearAll()
{
    username.val("");
    password.val("");
}

function error(message)
{
    clearAll();
    errordiv.html(message);
    loginform.hide();
    logoutbtn.hide();
    errordiv.show();
}