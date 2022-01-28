function verificarPassword() {

    var pass = $("#passwordGastos").val();
    var passEncrip = CryptoJS.MD5(pass);
    var encrip = localStorage.getItem("password");
    console.log(pass);
    console.log(passEncrip);
    if (passEncrip == encrip) {
        limpiar();
        location.href = "retiro_depositar.html";
    } else {
        alert("Datos incorrectos");
    }

}

function limpiar() {
    $("#passwordGastos").val('');
}

function limpiarRetiro() {
    $("#tipoGastos").val("0");
    $("#conceptoGastos").val("");
    $("#importeGastos").val("");

}

function guardarGastos() {

    var tipotxt = $("#tipoGastos").val();
    var conceptotxt = $("#conceptoGastos").val();
    var importetxt = $("#importeGastos").val();

    if (tipotxt == "0" || conceptotxt == "" || importetxt == "") {
        alert("Completa tus datos por favor");
        return null;
    }

    $.ajax({
        url: "http://localhost:8082/v1/gastos",
        type: "POST",
        data: JSON.stringify({
            idTurno: "1",
            tipo: tipotxt,
            concepto: conceptotxt,
            monto: importetxt
        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {

            alert('Registro agregado exitosamente !!!');
            limpiarRetiro();
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}