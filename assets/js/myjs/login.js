/*
$('#btn_login').click(function(){
    console.log("entre")

    $.ajax({
        type: "POST",
        url: "localhost:8082/v1/usuarios",
        data: JSON.stringify(
            {
                username:$('#user').val(),
                password:$('#pass').val
            }
        ),
        dataType: "application/json",
        success: function (response) {
            sessionStorage.setItem("accesToken", data.access_token);
            window.localStorage.href = "";
        },
        error: function() {

        }
    });
})

*/