var tipoPago = "";
var esPropina = false;


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
                propinaEfectivo: "0",
                propinaVisa: "0",
                propinaMasterCard: "0",
                propinaAmericanExpress: "0",
                propinaPagada: "false",
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

function cerrarCuenta() {
    var importeTotal = $("#totalImporteTotal").val();
    var consumo = sessionStorage.getItem("totalConsumo");

    if (importeTotal < consumo) {
        alert("No se ha cubierto en su totalidad la orden, no se puede realizar el registro del pago");
    } else {
        var fecha = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000));
        idCuentatxt = localStorage.getItem("idCuenta");
        totalPropinatxt = $("#totalPropina").val();
        var importeEfectivotxt = $("#importeEfectivo").text();
        if (importeEfectivotxt > consumo) {
            importeEfectivotxt = consumo;
        }

        $.ajax({
            url: "http://localhost:8082/v1/cuentas-cambiar/4",
            type: "POST",
            data: JSON.stringify({
                idCuenta: idCuentatxt,
                cierre: fecha,
                propina: totalPropinatxt,
                descuento: "0",
                montoTotal: consumo,
                montoTotalDescuento: "0",
                estatus: "cerrada",
                impreso: "Si",
                pagoEfectivo: importeEfectivotxt,
                pagoVisa: $("#importeVisa").text(),
                pagoMasterCard: $("#importeMasterCard").text(),
                pagoAmericanExpress: $("#importeAmericanExpress").text(),
                propinaEfectivo: $("#propinaEfectivo").text(),
                propinaVisa: $("#propinaVisa").text(),
                propinaMasterCard: $("#propinaMasterCard").text(),
                propinaAmericanExpress: $("#propinaAmericanExpress").text(),
                huboDescuento: "false"
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                alert('Se registro el pago correctamente !!!');
                location.href = "servicio_comedor.html";
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

function asignarTipoPago(tipoPago) {

    if (tipoPago === "propina") {
        this.esPropina = !this.esPropina;
    } else {
        console.log("ingreso");
        this.tipoPago = tipoPago;
    }
}

function asignarDatosPagarCuenta() {
    //    console.log("Tipo " + this.tipoPago + " es propina: " + this.esPropina)
    $("#consumoTotal").val(sessionStorage.getItem("totalConsumo"));
    var txtValor = $("#valorIngresado").val();
    if (txtValor === "" || this.tipoPago === "") {
        alert("Por favor ingresa un valor o selecciona el tipo de pago que se va a realizar");
        return null;
    } else {
        if (this.esPropina === true) {
            if (this.tipoPago === "efectivo") { $("#propinaEfectivo").text(txtValor); }
            if (this.tipoPago === "visa") { $("#propinaVisa").text(txtValor); }
            if (this.tipoPago === "masterCard") { $("#propinaMasterCard").text(txtValor); }
            if (this.tipoPago === "americanExpress") { $("#propinaAmericanExpress").text(txtValor); }

        } else {
            if (this.tipoPago === "efectivo") {
                $("#importeEfectivo").text(txtValor);
                $("#cambioMN").val(txtValor - $("#totalMN").val());
            }
            if (this.tipoPago === "visa") { $("#importeVisa").text(txtValor); }
            if (this.tipoPago === "masterCard") { $("#importeMasterCard").text(txtValor); }
            if (this.tipoPago === "americanExpress") { $("#importeAmericanExpress").text(txtValor); }

        }
    }
    actualizarValores();
    var txtValor = $("#valorIngresado").val("");
}

function actualizarValores() {

    var toimpEfec = parseFloat($("#importeEfectivo").text()) + parseFloat($("#propinaEfectivo").text());
    var toimpVisa = parseFloat($("#importeVisa").text()) + parseFloat($("#propinaVisa").text());
    var toimpMast = parseFloat($("#importeMasterCard").text()) + parseFloat($("#propinaMasterCard").text());
    var toimpAmer = parseFloat($("#importeAmericanExpress").text()) + parseFloat($("#propinaAmericanExpress").text());

    $("#importeTotalEfectivo").text(toimpEfec);
    $("#importeTotalVisa").text(toimpVisa);
    $("#importeTotalMasterCard").text(toimpMast);
    $("#importeTotalAmericanExpress").text(toimpAmer);

    $("#totalImporte").val(parseFloat($("#importeEfectivo").text()) + parseFloat($("#importeVisa").text()) + parseFloat($("#importeMasterCard").text()) + parseFloat($("#importeAmericanExpress").text()));
    $("#totalPropina").val(parseFloat($("#propinaEfectivo").text()) + parseFloat($("#propinaVisa").text()) + parseFloat($("#propinaMasterCard").text()) + parseFloat($("#propinaAmericanExpress").text()));
    $("#totalImporteTotal").val(parseFloat($("#importeTotalEfectivo").text()) + parseFloat($("#importeTotalVisa").text()) + parseFloat($("#importeTotalMasterCard").text()) + parseFloat($("#importeTotalAmericanExpress").text()));
}

function datosInicialesPagar() {
    $("#consumoTotal").val(sessionStorage.getItem("totalConsumo"));
    $("#totalMN").val(sessionStorage.getItem("totalConsumo"));
}