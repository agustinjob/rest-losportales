function abrirCuenta() {

    nombreCuentatxt = "";
    personastxt = "";
    idMeserotxt = "";
    nombreMeserotxt = "";
    idTurnotxt;
    var fecha = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000));

    $.ajax({
        url: "http://localhost:8082/v1/cuentas",
        type: "POST",
        data: JSON.stringify({
            nombreCuenta: nombreCuentatxt,
            apertura: fecha,
            cierre: fecha,
            tipoPago: "", //puede que no vaya
            idMesero = idMeserotxt,
            nombreMesero = nombreMeserotxt,
            propina: 0,
            descuento: 0,
            montoTotal: 0,
            montoTotalDescuento: 0,
            personas: personastxt,
            orden: "",
            folio: "",
            productos: {},
            estatus: "abierta",
            impreso: "No",
            pagoEfectivo: 0,
            pagoVisa: 0,
            pagoMasterCard: 0,
            pagoAmericanExpress: 0,
            cantidadPago: 0,
            propinaEfectivo: 0,
            propinaVisa: 0,
            propinaMasterCard: 0,
            propinaAmericanExpress: 0,
            propinaPagada: 0,
            huboDescuento: 0
        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            limpiar();
            obtenerDatos();
            alert('Registro agregado exitosamente !!!');
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}

function obtenerDatosCuentasAbiertas() {

    var idTurno = localStorage.getItem('idTurno');


    $.ajax({
        url: "http://localhost:8082/v1/cuentas/" + idTurno + "/vigente",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $('#tablaCuentas > tbody').empty();
            $.each(data, function(i, item) {
                var rows =
                    "<tr>" +
                    "<td>" + item.nombreCuenta + "</td>" +
                    "<td>" + item.impresa + "</td>" +
                    "<td>" + item.nombreMesero + "</td>" +
                    "<td>" + item.orden + "</td>" +
                    "</tr>";
                $('#tablaCuentas > tbody').append(rows);
            });
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}