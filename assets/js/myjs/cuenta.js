function obtenerCuentasAbiertas() {

    var idTurno = localStorage.getItem('idTurno');
    if (idTurno == null) {
        alert("No haz abierto cuenta, no podras ver los datos");
    } else {
        // console.log("http://localhost:8082/v1/cuentas/" + idTurno + "/abierta");
        $.ajax({
            url: "http://localhost:8082/v1/cuentas/" + idTurno + "/abierta",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#tablaCuentas > tbody').empty();
                $.each(data, function(i, item) {
                    var rows =
                        "<tr>" +
                        "<td><a onclick='datosCuenta(\"" + item.idCuenta + "\")' style='cursor:pointer;' >" + item.nombreCuenta + "</a></td>" +
                        "<td>" + item.impreso + "</td>" +
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
}

function datosCuenta(idCuenta) {

    localStorage.setItem("idCuenta", idCuenta);
    $.ajax({
        url: "http://localhost:8082/v1/cuentas/" + idCuenta,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $("#cuentaInfo").val(data.nombreCuenta);
            $("#folioInfo").val(data.folio);
            $("#mesaInfo").val(data.mesa);
            $("#meseroInfo").val(data.nombreMesero);
            $("#ordenInfo").val(data.orden);
            $("#personaInfo").val(data.personas);
            $("#aperturaInfo").val(data.apertura);
            $("#cierreInfo").val(data.cierre);
            $("#nombreCuentaCambiar").val(data.nombreCuenta);
            $("#aceptarNuevoNombre").prop('disabled', false);
            //IVA * .138

            $('#tablaProductosOrden > tbody').empty();
            var importeTotal = 0;
            $.each(data.productos, function(i, item) {
                console.log("Nombre " + item.nombre);
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
            });
            var iva = importeTotal * .138;
            $("#subtotal").val(importeTotal - iva);
            $("#impuesto").val(iva);
            $("#total").val(importeTotal);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}


function limpiar() {
    $("#nombreCuenta").val('');
    $("#personasCuenta").val('');
    //  $("#cuentaMeseros").val('');
    //  $("#cuentaMeseros").text('');

}



function abrirCuenta() {
    var idTurnotxt = localStorage.getItem('idTurno');
    if (idTurnotxt == null) {
        alert("Tienes que abrir turno para abrir una cuenta");
    } else {
        nombreCuentatxt = $("#nombreCuenta").val();
        personastxt = $("#personasCuenta").val();
        idMeserotxt = $("#cuentaMeseros").val();
        nombreMeserotxt = $("#cuentaMeseros option:selected").text();
        idTurnotxt = localStorage.getItem("idTurno");
        var fecha = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000));

        //puede que no vaya el tipoPago
        $.ajax({
            url: "http://localhost:8082/v1/cuentas",
            type: "POST",
            data: JSON.stringify({
                nombreCuenta: nombreCuentatxt,
                idTurno: idTurnotxt,
                apertura: fecha,
                cierre: "",
                tipoPago: "",
                idMesero: idMeserotxt,
                nombreMesero: nombreMeserotxt,
                propina: "0",
                descuento: "0",
                montoTotal: "0",
                montoTotalDescuento: "0",
                personas: personastxt,
                orden: "0",
                folio: "0",
                productos: [],
                estatus: "abierta",
                impreso: "No",
                pagoEfectivo: "0",
                pagoVisa: "0",
                pagoMasterCard: "0",
                pagoAmericanExpress: "0",
                cantidadPago: "0",
                propinaEfectivo: "0",
                propinaVisa: "0",
                propinaMasterCard: "0",
                propinaAmericanExpress: "0",
                propinaPagada: "0",
                huboDescuento: "false"
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                limpiar();
                obtenerCuentasAbiertas();
                $("#cuentaInfo").val(data.nombreCuenta);
                $("#folioInfo").val(data.folio);
                $("#mesaInfo").val(data.mesa);
                $("#meseroInfo").val(data.nombreMesero);
                $("#ordenInfo").val(data.orden);
                $("#personaInfo").val(data.personas);
                $("#aperturaInfo").val(data.apertura);
                $("#cierreInfo").val(data.cierre);
                localStorage.setItem("idCuenta", data.idCuenta);
                $("#aceptarNuevoNombre").prop('disabled', false);
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
}

function renombrarCuenta() {

    var nuevotxt = $("#nuevoNombreCuentaCambiar").val();
    var idCuentatxt = localStorage.getItem("idCuenta");
    $.ajax({
        url: "http://localhost:8082/v1/cuentas-cambiar/1",
        type: "POST",
        data: JSON.stringify({
            idCuenta: idCuentatxt,
            nombreCuenta: nuevotxt

        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $("#cuentaInfo").val(data.nombreCuenta);
            obtenerCuentasAbiertas();
            alert('Registro modificado exitosamente !!!');
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}


function realizarCambioMesero() {
    var nuevomeseroidtxt = $("#cambioMesero").val();
    var nuevomeseronombretxt = $("#cambioMesero option:selected").text();
    var idCuentatxt = localStorage.getItem("idCuenta");
    $.ajax({
        url: "http://localhost:8082/v1/cuentas-cambiar/2",
        type: "POST",
        data: JSON.stringify({
            idCuenta: idCuentatxt,
            idMesero: nuevomeseroidtxt,
            nombreMesero: nuevomeseronombretxt

        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            obtenerCuentasAbiertas();
            $("#meseroInfo").val(data.nombreMesero);
            alert('Registro modificado exitosamente !!!');
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}

function verificaCuentaSeleccionada() {
    var idCuenta = localStorage.getItem("idCuenta");
    if (idCuenta == null) {
        alert("Selecciona una cuenta para cambiar su nombre");
        $("#aceptarNuevoNombre").prop('disabled', true);

    }
}