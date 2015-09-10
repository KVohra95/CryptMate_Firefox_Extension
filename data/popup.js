/**
 * Created by Kabeer.Vohra on 8/27/2015.
 */

var domain = "";
var token = "";
var newpassword = "";
var subscriptionended = false;
var params = {};
var passwordform = $("#password");
var newpasswordform = $("#newpassword");
var confirmpasswordform = $("#confirmpassword");
var createnewpassworddiv = $("#createnewpassword");
var generatepassworddiv = $("#generatepassword");
var showpassworddiv = $("#showpassword");
var errordiv = $("#error");
var formsdiv = $("#forms");
var linkdomains = $("#linkdomains");

$('#passwordform').on('submit', function(e)
{
    var textBox = $('#textbox');
    var returnVal = textBox.val();
    textBox.val("");

    self.port.emit("password-generated", returnVal);
});

self.port.on("subscriptionstatus", function(status)
{
    subscriptionended = status[0];
    token = status[1];
    domain = status[2];

    if (subscriptionended)
    {
        error("Subscription has ended, please extend subscription to continue using the app");
    }
    else if (token == null)
    {
        error("Not logged in, please log in from the addon options menu");
    }
    else
    {
        clearAll();
        formsdiv.show();
        showForms();
    }
});

function showForms()
{
    params =
    {
        token: token,
        domain: domain
    };

    $.ajax({
        type: "POST",
        url: "https://www.cryptmate.com/processing/rest.php",
        data: params,
        success: function(data, status)
        {
            var returndata = JSON.parse(data);
            switch (returndata.returntype)
            {
                case "error":
                    if(returndata.error == "invalidtoken")
                    {
                        self.port.emit("remove", "token");
                        error("Logged in account not recognised, please log in again from the addon options menu");
                    }
                    else
                    {
                        error(returndata.error);
                    }
                    break;

                case "newpassword":
                    newpassword = returndata.newpassword;
                    if (newpassword)
                    {
                        clearAll();
                        errordiv.hide();
                        generatepassworddiv.hide();
                        showpassworddiv.hide();
                        createnewpassworddiv.show();

                        linkdomains.append($('<option></option>').val("").html(""));

                        var keyeddomains = returndata.keyeddomains;

                        $.each(keyeddomains, function(i)
                        {
                            linkdomains.append
                            (
                                $('<option></option>').val(keyeddomains[i]).html(keyeddomains[i])
                            );
                        });
                    }
                    else
                    {
                        clearAll();
                        errordiv.hide();
                        createnewpassworddiv.hide();
                        showpassworddiv.hide();
                        generatepassworddiv.show();
                    }
                    break;
            }
        },
        error: function() {error("Internet connection failure, please try again when internet connection is active")}
    });
}

$("form").on('submit', function (e)
{
    switch (e.target.id)
    {
        case "createnewpassword":
            var newpassword = newpasswordform.val();
            var confirmpassword = confirmpasswordform.val();
            var linkeddomain = linkdomains.find("option:selected").text();

            if (newpassword == confirmpassword)
            {
                params =
                {
                    token: token,
                    password: newpassword,
                    domain: domain,
                    newpassword: 1,
                    linkeddomain: linkeddomain
                };

                $.ajax({
                    type: "POST",
                    url: "https://www.cryptmate.com/processing/rest.php",
                    data: params,
                    success: function(data, status)
                    {
                        var returndata = JSON.parse(data);
                        switch (returndata.returntype)
                        {
                            case "error":
                                error(returndata.error);
                                break;
                            case "password":
                                clearAll();
                                self.port.emit("password-generated", returndata.hash);
                                break;
                        }
                    },
                    error: function() {error("Internet connection failure, please try again when internet connection is active")}
                });
            }
            else
            {
                error("Passwords do not match, please try again");
            }
            break;
        case "generatepassword":
            var password = passwordform.val();
            params =
            {
                token: token,
                password: password,
                domain: domain,
                newpassword: 0
            };

            $.ajax({
                type: "POST",
                url: "https://www.cryptmate.com/processing/rest.php",
                data: params,
                success: function(data, status)
                {
                    var returndata = JSON.parse(data);
                    switch (returndata.returntype)
                    {
                        case "error":
                            error(returndata.error);
                            break;
                        case "password":
                            clearAll();
                            self.port.emit("password-generated", returndata.hash);
                            break;
                    }
                },
                error: function() {error("Internet connection failure, please try again when internet connection is active")}
            });

            break;
    }
    return false;
});

function clearAll()
{
    passwordform.value = "";
    newpasswordform.value = "";
    confirmpasswordform.value = "";
}

function error(message)
{
    clearAll();
    errordiv.html(message);
    formsdiv.hide();
    errordiv.show();
}