/**
 * Created by Kabeer.Vohra on 8/27/2015.
 */

var domain = "";
var token = "";
var newpassword = "";
var passwordform = document.getElementById('password');
var newpasswordform = document.getElementById('newpassword');
var confirmpasswordform = document.getElementById('confirmpassword');
var generatedpasswordform = document.getElementById('generatedpassword');

$('#passwordform').on('submit', function(e)
{
    var textBox = $('#textbox');
    var returnVal = textBox.val();
    textBox.val("");

    self.port.emit("password-generated", returnVal);
});

self.port.on("subscriptionstatus", function(status)
{
    var subscriptionended = status[0];
    //token = status[1];
    domain = status[2];
    token = "HCoUQ9yGbjSP4iyLLAClrXCVbh3Uc2ZHuds9cOFbVlROrdq2BScSDFDCKtkKl0iDbyBbc5cYgRCvUQmlwn2ZStpqMz2Xx0qyxSxxMxjQfKcXqo8NBYAhfQySdnFAkUWFAj3cFcRIKTv16qBvf1CkGY1JbuajeUOE3FExFl6f5o6YFvjIlLSPyJox4mH66lzXQ2klddq6rkTWD3uOCbr1IFnzQUuL7RyKIGWLJaFYkoLLh4pH3GxAaKZOvhnpYLXx";
    if (subscriptionended == true)
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
        $("#subscriptionended").hide();
        $("#loginprompt").hide();
        $("#forms").show();
        showForms();
    }
});

function showForms()
{
    var params =
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
                        $("#generatepassword").hide();
                        $("#showpassword").hide();
                        $("#createnewpassword").show();
                    }
                    else
                    {
                        clearAll();
                        $("#createnewpassword").hide();
                        $("#showpassword").hide();
                        $("#generatepassword").show();
                    }
                    break;
            }
        },
        error: error("Internet connection failure, please try again when internet connection is active")
    });
}

$("form").on('submit', function (e)
{
    switch (e.target.id)
    {
        case "createnewpassword":
            var newpassword = document.getElementById('newpassword').value;
            var confirmpassword = document.getElementById('confirmpassword').value;
            if (newpassword == confirmpassword)
            {
                var params =
                {
                    token: token,
                    password: newpassword,
                    domain: domain,
                    newpassword: true
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
                                $("#createnewpassword").hide();
                                $("#generatepassword").hide();
                                $("#showpassword").show();
                                $("#generatedpassword").val(returndata.hash);
                                break;
                        }
                    },
                    error: error("Internet connection failure, please try again when internet connection is active")
                });
            }
            else
            {
                error("Passwords do not match, please try again");
            }
            break;
        case "generatepassword":
            var password = document.getElementById('password').value;
            var params =
            {
                token: token,
                password: password,
                domain: domain,
                newpassword: false
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
                            $("#createnewpassword").hide();
                            $("#generatepassword").hide();
                            $("#showpassword").show();
                            $("#generatedpassword").val(returndata.hash);
                            break;
                    }
                },
                error: error("Internet connection failure, please try again when internet connection is active")
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
    generatedpasswordform.value = "";
}

function error(message)
{
    clearAll();
    console.log(message);
}