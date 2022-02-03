var tipoPago = "";
var esPropina = false;
var productosAdividir = [];
var productosAdividirN1 = [];
var productosAdividirN2 = [];
var productosAdividirN3 = [];
var productosAdividirTemporal = [];
var cantidadProductosTotal = 0;
var cantidadProductosTomada = 0;
var productosACancelar = [];
var cuentasGlobal = [];

function inicializarArrays() {
    tipoPago = "";
    esPropina = false;
    productosAdividir = [];
    productosAdividirN1 = [];
    productosAdividirN2 = [];
    productosAdividirN3 = [];
    productosAdividirTemporal = [];
    cantidadProductosTotal = 0;
    cantidadProductosTomada = 0;
    productosACancelar = [];
    cuentasGlobal = [];
}

function hayCuentaSeleccionada() {
    var idCuenta = localStorage.getItem("idCuenta");
    if (idCuenta === null) {
        agregarClase("btnCancelar");
        agregarClase("btnJuntar");
        agregarClase("btnDividir");
        agregarClase("btnCapturar");
        agregarClase("btnRenombrar");
        agregarClase("btnMesero");
        agregarClase("btnDescuentos");
        agregarClase("btnPagar");
        agregarClase("btnImprimir");
        agregarClase("btnReabrir");
    } else {
        var cuenta = buscarCuentaPorId(idCuenta)[0];
        modificable = cuenta.esModificable;
        if (modificable == true) {
            quitarClase("btnCancelar");
            quitarClase("btnJuntar");
            quitarClase("btnDividir");
            quitarClase("btnCapturar");
            quitarClase("btnRenombrar");
            quitarClase("btnMesero");
            quitarClase("btnDescuentos");
            quitarClase("btnPagar");
            quitarClase("btnImprimir");
            quitarClase("btnReabrir");
        } else {
            quitarClase("btnImprimir");
            quitarClase("btnReabrir");
            quitarClase("btnPagar");
        }


    }
}


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
                cuentasGlobal = data;

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

                hayCuentaSeleccionada();
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
            sessionStorage.setItem("nombreCuenta", data.nombreCuenta);
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
            $("#total").val(importeTotal - data.montoTotalDescuento);
            sessionStorage.setItem("totalConsumo", importeTotal);
            hayCuentaSeleccionada();
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}



function asignarDescuento() {
    var importeTotal = $("#total").val();
    var porcentajeDescunto = $("#porcentajeDescuento").val();
    var porcentaje = porcentajeDescunto / 100;
    var descuentoTotal = porcentaje * importeTotal;
    $("#descuento").val(descuentoTotal);
    $("#total").val(importeTotal - descuentoTotal);
    var idCuentatxt = localStorage.getItem("idCuenta");

    $.ajax({
        url: "http://localhost:8082/v1/cuentas-cambiar/8",
        type: "POST",
        data: JSON.stringify({
            idCuenta: idCuentatxt,
            comentarioDescuento: $("#comentarioDescuento").val(),
            descuento: porcentajeDescunto,
            montoTotal: $("#total").val(),
            montoTotalDescuento: descuentoTotal
        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            if (data == null) {
                alert("Ocurrio un error");
            } else {
                alert("Descuento agregado correctamente");
                obtenerCuentasAbiertas();
                datosCuenta(data.idCuenta);
            }
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}


function limpiarComedor() {
    $("#nombreCuenta").val('');
    $("#personasCuenta").val('');
    localStorage.removeItem("idCuenta");
    sessionStorage.removeItem("totalConsumo");

    //  $("#cuentaMeseros").val('');
    //  $("#cuentaMeseros").text('');

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

function abrirCuenta() {
    var idTurnotxt = localStorage.getItem('idTurno');
    if (idTurnotxt == null) {
        alert("Tienes que abrir turno para abrir una cuenta");
        return null;
    }

    if (nombreCuenta === "" || personasCuenta === "" || $("#cuentaMeseros").val() === "0" || $("#cuentaMesa").val() === "0") {

        alert("Por favor llena todos los datos");
        return null; //
    } else {
        nombreCuentatxt = $("#nombreCuenta").val();
        var seEncontro = buscarCuentaPorNombre(nombreCuentatxt);
        if (seEncontro == false) {
            personastxt = $("#personasCuenta").val();
            idMeserotxt = $("#cuentaMeseros").val();
            nombreMeserotxt = $("#cuentaMeseros option:selected").text();
            nombreMesatxt = $("#cuentaMesa option:selected").text();
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
                    mesa: nombreMesatxt,
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
                    limpiarComedor();
                    obtenerCuentasAbiertas();
                    cerrarModal("defaultModal");
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
                    $("#tablaProductosOrden > tbody").empty(); //aqui
                    inicializarArrays();
                    alert('Registro agregado exitosamente !!!');
                },
                failure: function(data) {
                    alert(data.responseText);
                },
                error: function(data) {
                    alert(data.responseText);
                }
            });
        } else {
            alert("Ya existe otra cuenta con ese nombre");
        }
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

// Funcionalidad de imprimir

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
            cierreParaImprimir(idCuentatxt);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}

function renombrarCuenta() {

    var nuevotxt = $("#nuevoNombreCuentaCambiar").val();
    var encontrado = buscarCuentaPorNombre(nuevotxt);
    if (encontrado === true) {
        mostrarMensaje("Ya existe una cuenta con ese nombre");
    } else {
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
                cerrarModal("renModal");
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
        this.tipoPago = tipoPago;
    }
}

// Logica de pagar cuenta 

function enviarAPagar() {
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
            location.href = "pagar.html";
            //   cierreParaImprimir(idCuentatxt);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

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

function obtenerCatalogos() {

    obtenerDatosSelect('#divCuentaMesero', 'cuentaMeseros', 'NO');
    obtenerDatosSelectMesa('#divCuentaMesa', 'cuentaMesa', 'NO');
}

function asignarDatosJuntarCuenta() {
    var ncuenta = sessionStorage.getItem("nombreCuenta");
    $("#cuentaOrigen").val(ncuenta);

}

function juntarCuentas() {
    var cuentaDestino = $("#cuentaDestino").val();
    var idTurno = localStorage.getItem("idTurno");
    var idCuenta = localStorage.getItem("idCuenta");


    $.ajax({
        url: "http://localhost:8082/v1/cuentas-juntar/" + idTurno + "/abierta/" + cuentaDestino + "/" + idCuenta,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            if (data == null) {
                alert("El nombre de la cuenta no existe");
            } else {
                alert("Cuentas unidas satisfactoriamente");
                obtenerCuentasAbiertas();
                datosCuenta(data.idCuenta);
            }
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}

// DIVIDIR CUENTA //////////////////////////////////////***************************************************************************************** */

function datosCuentaDividir() {

    var idCuenta = localStorage.getItem("idCuenta");
    $.ajax({
        url: "http://localhost:8082/v1/cuentas/" + idCuenta,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            productosAdividir = data.productos;
            $("#NombreDividirCuentaOrigen").val(data.nombreCuenta);
            $("#NombreDividirCuentaOrigen").prop("disabled", true);

            imprimirDatosCuentaOrigen();
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}

function imprimirDatosCuentaOrigen() {
    $('#tablaDividirCuentaProductos > tbody').empty();
    cantidadProductosTotal = 0;
    cantidadProductosTomada = 0;
    $.each(productosAdividir, function(i, item) {

        var rowsProd =
            "<tr>" +
            "<td><button onclick='asignarProductosDividir(" + i + ");' id='" + i + "'>" + (i + 1) + "</button></td>" +
            "<td> <span id='" + i + "cantidadProducto'>" + item.cantidad + "</span></td>" +
            "<td> <input type='number' value='0' id='" + i + "cantidad'></td>" +
            "<td>" + item.nombre + "</td>" +
            "</tr>";
        cantidadProductosTotal = cantidadProductosTotal + item.cantidad;

        $('#tablaDividirCuentaProductos > tbody').append(rowsProd);
    });
}

function asignarProductosDividir(id) {

    var cantidad = parseInt($("#" + id + "cantidad").val());
    var cantidadProducto = parseInt($("#" + id + "cantidadProducto").text());

    if (cantidad === 0) {
        alert("Por favor ingresa una cantidad");
        return null;
    }
    if (cantidad > cantidadProducto) {
        alert("La cantidad ingresada no puede ser mayor a la cantidad que se tiene del procuto");
        return null;
    } else {
        cantidadProductosTomada = cantidadProductosTomada + cantidad;
        if (cantidadProductosTomada < cantidadProductosTotal) {
            $("#" + id).prop('disabled', true);

            var productoTemp = $.extend({}, productosAdividir[id]);
            var res = productoTemp.cantidad - cantidad;
            productosAdividir[id].cantidad = res;
            productoTemp.cantidad = cantidad;
            productosAdividirTemporal.push(productoTemp);

            $("#" + id + "cantidad").prop('disabled', true);

        } else {
            alert("No puedes enviar todos los productos a otras cuentas");
        }
    }
}

function asignarProductosANuevaTabla(numCuenta) {
    if (numCuenta === 1) {
        productosAdividirN1 = productosAdividirTemporal.slice();
        productosAdividirTemporal = [];
    }
    if (numCuenta === 2) {
        productosAdividirN2 = productosAdividirTemporal.slice();
        productosAdividirTemporal = [];
    }
    if (numCuenta === 3) {
        productosAdividirN3 = productosAdividirTemporal.slice();
        productosAdividirTemporal = [];
    }

    $("#asignar" + numCuenta).prop('disabled', true);


    productosAdividir = productosAdividir.filter(item => item.cantidad != 0);
    imprimirValoresEnTabla(numCuenta);
    imprimirDatosCuentaOrigen();
}

function imprimirValoresEnTabla(numCuenta) {

    $('#cuentaNueva' + numCuenta + '> tbody').empty();
    var importeTotal = 0;
    var nombre = "productosAdividirN" + numCuenta;
    $.each(eval(nombre), function(i, item) {
        var rowsProd =
            "<tr>" +
            "<td>" + item.cantidad + "</td>" +
            "<td>" + item.nombre + "</td>" +
            "</tr>";
        importeTotal = importeTotal + (item.cantidad * item.costo);
        $('#cuentaNueva' + numCuenta + '> tbody').append(rowsProd);

    });

    $("#cuentaN" + numCuenta + "txt").val(importeTotal);
}

function realizarDivision() {
    if (productosAdividirN1.length > 0 || productosAdividirN2.length > 0 || productosAdividirN3.length > 0) {
        modificarCuentaPrincipalPorDivision();
        var nombreC = $("#NombreDividirCuentaOrigen").val();
        if (productosAdividirN1.length > 0) {
            agregarCuentasSecundariasPorDivision(productosAdividirN1, nombreC + '-A');
        }
        if (productosAdividirN2.length > 0) {
            agregarCuentasSecundariasPorDivision(productosAdividirN2, nombreC + '-B');
        }
        if (productosAdividirN3.length > 0) {
            agregarCuentasSecundariasPorDivision(productosAdividirN3, nombreC + '-C');
        }
        alert("Se ha relizado la división de cuentas de manera correcta");
        location.href = "servicio_comedor.html";
    } else {
        alert("No hay ninguna modificación que realizar");
    }
}

function modificarCuentaPrincipalPorDivision() {
    var idCuentatxt = localStorage.getItem("idCuenta");
    $.ajax({
        url: "http://localhost:8082/v1/cuentas-cambiar/6",
        type: "POST",
        data: JSON.stringify({
            idCuenta: idCuentatxt,
            productos: productosAdividir
        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            if (data == null) {
                alert("El nombre de la cuenta no existe");
            } else {
                obtenerCuentasAbiertas();
                datosCuenta(data.idCuenta);
            }
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}

function agregarCuentasSecundariasPorDivision(productosArray, nombreCu) {
    var idCuentatxt = localStorage.getItem("idCuenta");
    $.ajax({
        url: "http://localhost:8082/v1/cuentas-cambiar/7",
        type: "POST",
        data: JSON.stringify({
            idCuenta: idCuentatxt,
            productos: productosArray,
            nombreCuenta: nombreCu
        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            if (data == null) {
                alert("El nombre de la cuenta no existe");
            } else {
                alert("Cuentas unidas satisfactoriamente");
                obtenerCuentasAbiertas();
                datosCuenta(data.idCuenta);
            }
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}

// Cancelar productos

function datosCuentaCancelarProductos() {


    $('#tablaProductosACancelar > tbody').empty();
    $.each(productosACancelar, function(i, item) {
        var rowsProd =
            "<tr>" +
            "<td><button onclick='asignarProductosACancelar(" + i + ");' id='btnCance" + i + "'>" + (i + 1) + "</button></td>" +
            "<td> <span id='" + i + "cantidadCapturadaProducto'>" + item.cantidad + "</span></td>" +
            "<td>" + item.nombre + "</td>" +
            "<td> <input type='number' value='0' id='" + i + "cantidadACancelar'></td>" +
            "<td><select id='motivoCancelacion'>" +
            "<option value='ERROR DE CAPTURA'>ERROR DE CAPTURA</option> <option value='CAMBIO DE OPINION CLIENTE'>CAMBIO OPINION CLIENTE</option>" +
            "<option value='MAL SABOR'>MAL SABOR</option><option value='SERVICIO LENTO'>SERVICIO LENTO</option>" +
            "</select></td>" +
            "</tr>";

        $('#tablaProductosACancelar > tbody').append(rowsProd);
    });

}

function asignarProductosACancelar(posicion) {

    var cantidadCapturada = parseInt($("#" + posicion + "cantidadCapturadaProducto").text());
    var cantidadACancelar = parseInt($("#" + posicion + "cantidadACancelar").val());

    var motivo = $("#motivoCancelacion option:selected").text();

    if (cantidadACancelar === 0) {
        alert("Por favor ingresa una cantidad");
        return null;
    } else {
        if (cantidadACancelar > cantidadCapturada) {
            alert("No puedes cancelar más producto del que se tiene");
            return null;
        } else {

            $("#btnCance" + posicion).prop('disabled', true);
            var res = cantidadCapturada - cantidadACancelar;
            console.log(motivo);
            var procancetem = productosACancelar[posicion];
            if (res === 0) {

                procancetem.estatus = "cancelado";
                procancetem.cantidadCancelado = cantidadACancelar;
                procancetem.motivoCancelacion = motivo;
            } else {

                procancetem.estatus = "Parcial";
                procancetem.cantidadCancelado = cantidadACancelar;
                procancetem.motivoCancelacion = motivo;
                procancetem.cantidad = res;
                procancetem.importe = (res * procancetem.costo);
            }
            console.log(procancetem);
        }
    }
}


function modificarCuentaProductosCancelados() {
    var idCuentatxt = localStorage.getItem("idCuenta");
    $.ajax({
        url: "http://localhost:8082/v1/cuentas-cambiar/6",
        type: "POST",
        data: JSON.stringify({
            idCuenta: idCuentatxt,
            productos: productosACancelar
        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            if (data == null) {
                alert("Ocurrio un error");
            } else {
                alert("Datos cancelados correctamente");
                obtenerCuentasAbiertas();
                datosCuenta(data.idCuenta);
            }
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}

// Buscar cuentas por nombre

function buscarCuentaPorNombre(nombre) {

    var encontrado = cuentasGlobal.filter(item => item.nombreCuenta === nombre);
    if (encontrado.length > 0) {
        return true;
    }
    return false;
}

function buscarCuentaPorId(id) {
    var encontrado = cuentasGlobal.filter(item => item.idCuenta === id);
    return encontrado;
}