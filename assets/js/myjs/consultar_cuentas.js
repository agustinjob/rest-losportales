var cuentasGlobal = [];
var pagoEfectivo = 0;
var propinaEfectivo = 0;
var pagoTarjeta = 0;
var propinaTarjeta = 0;

function obtenerCuentas() {

    var idTurnotxt = localStorage.getItem('idTurno');
    var tipotxt = $("#tipo").val();
    var fechatxt = $("#fecha").val();

    $.ajax({
        url: "http://localhost:8082/v1/cuentas-consultar",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            tipo: tipotxt,
            fecha: fechatxt,
            idTurno: idTurnotxt
        }),
        success: function(data) {
            cuentasGlobal = data;

            $('#tablaCuentas > tbody').empty();
            $.each(data, function(i, item) {
                if (item.cierre == null) {
                    item.cierre = "";
                }
                var rows =
                    "<tr>" +
                    "<td><a onclick='datosCuenta(\"" + item.idCuenta + "\")' style='cursor:pointer;' >" + item.folio + "</a></td>" +
                    "<td>" + item.cierre + "</td>" +
                    "<td>" + item.nombreCuenta + "/" + item.mesa + "</td>" +
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

function mostrarPago() {
    alert("Pago efectivo: " + pagoEfectivo + "\n" +
        "Pago tarjeta: " + pagoTarjeta + "\n" +
        "Propina efectivo: " + propinaEfectivo + "\n" +
        "Propina tarjeta: " + propinaTarjeta + "\n");
}

function datosCuenta(idCuenta) {

    localStorage.setItem("idCuenta", idCuenta);
    $.ajax({
        url: "http://localhost:8082/v1/cuentas/" + idCuenta,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $("#cuentaInfo").val(data.nombreCuenta);
            sessionStorage.setItem("nombreCuenta", data.nombreCuenta);
            $("#folioConsumoInfo").val(data.folio);
            $("#mesaInfo").val(data.mesa);
            $("#meseroInfo").val(data.nombreMesero);
            $("#ordenInfo").val(data.orden);
            $("#personaInfo").val(data.personas);
            $("#aperturaInfo").val(data.apertura);
            $("#fechaCuentaInfo").val(data.apertura);
            $("#cierreInfo").val(data.cierre);
            $("#nombreCuentaCambiar").val(data.nombreCuenta);
            $("#fechaCuentaInfo").val(data.apertura);
            $("#descuentoInfo").val(data.descuento);

            pagoEfectivo = data.pagoEfectivo;
            pagoTarjeta = data.pagoVisa + data.pagoMasterCard + data.pagoAmericanExpress;

            propinaEfectivo = data.propinaEfectivo;
            propinaTarjeta = data.propinaVisa + data.propinaMasterCard + data.propinaAmericanExpress;

            //IVA * .138

            $('#tablaProductosOrden > tbody').empty();
            var importeTotal = 0;
            productosACancelar = data.productos;
            $.each(data.productos, function(i, item) {
                if (item.estatus != "cancelado") {
                    var rowsProd =
                        "<tr>" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + item.nombre + "</td>" +
                        "<td>" + item.cantidad + "</td>" +
                        "<td>" + item.costo + "</td>" +
                        "<td>" + item.importe + "</td>" +
                        "</tr>";
                    importeTotal = importeTotal + item.importe;
                    $('#tablaProductosOrden > tbody').append(rowsProd);
                }
            });
            var iva = importeTotal * .138;
            $("#descuento").val(data.montoTotalDescuento);
            $("#subtotal").val(importeTotal - iva);
            $("#impuesto").val(iva.toFixed(2));
            $("#impuesto").val(iva.toFixed(2));
            $("#total").val(importeTotal - data.montoTotalDescuento);
            sessionStorage.setItem("totalConsumo", importeTotal);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}

function ReabrirCuenta() {

    var passCorrecto = verificarPasswordRegresandoRespuesta("password2");

    if (passCorrecto === true) {
        $("#password2").val("");
        var idCuentatxt = localStorage.getItem('idCuenta');
        $.ajax({
            url: "http://localhost:8082/v1/cuentas-cambiar/9",
            type: "POST",
            data: JSON.stringify({
                idCuenta: idCuentatxt,
                esModificable: true
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                cerrarModal("reNomModal");
                alert("Cuenta Re-Abierta correctamente");
                obtenerCuentasAbiertas();
            },
            failure: function(data) {
                alert(data.responseText);
            },
            error: function(data) {
                alert(data.responseText);
            }
        });
    } else {
        alert("password incorrecto");
    }
}

function cerrarCuentaSoloImpresion() {
    var fecha = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000));
    idCuentatxt = localStorage.getItem("idCuenta");

    $.ajax({
        url: "http://localhost:8082/v1/cuentas-cambiar/5",
        type: "POST",
        data: JSON.stringify({
            idCuenta: idCuentatxt,
            cierre: fecha,
            montoTotal: $("#totalConsumo").val(),
            montoSubtotal: $("#subtotal").val(),
            iva: $("#impuesto").val(),
            montoTotalDescuento: $("#descuento").val(),
            esModificable: false

        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            cierreParaImprimirSinObtenerCuentas(idCuentatxt);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}