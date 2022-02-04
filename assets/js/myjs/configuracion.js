function obtenerDatos() {

    $.ajax({
        url: "http://localhost:8082/v1/configuracion",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            localStorage.setItem("idConfiguracion", data.id);
            $("#nombre").val(data.nombre);
            $("#direccion").val(data.direccion);
            $("#rfc").val(data.rfc);
            $("#impresora").val(data.impresora);

            $("#nombretxt").text(data.nombre);
            $("#direcciontxt").text(data.direccion);
            $("#rfctxt").text(data.rfc);
            $("#impresoratxt").text(data.impresora);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}

function modificarDatos() {
    var nombretxt = $("#nombre").val();
    var direcciontxt = $("#direccion").val();
    var rfctxt = $("#rfc").val();
    var impresoratxt = $("#impresora").val();
    var idC = localStorage.getItem("idConfiguracion");
    if (nombretxt === "" || direcciontxt === "" || rfctxt === "" || impresoratxt === "") {
        alert("Por favor completa los datos");
        return null;
    }
    $.ajax({
        url: "http://localhost:8082/v1/configuracion",
        type: "PUT",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            id: idC,
            nombre: nombretxt,
            direccion: direcciontxt,
            rfc: rfctxt,
            impresora: impresoratxt
        }),
        success: function(data) {
            localStorage.setItem("idConfiguracion", data.id);
            $("#nombre").val(data.nombre);
            $("#direccion").val(data.direccion);
            $("#rfc").val(data.rfc);
            $("#impresora").val(data.impresora);

            $("#nombretxt").text(data.nombre);
            $("#direcciontxt").text(data.direccion);
            $("#rfctxt").text(data.rfc);
            $("#impresoratxt").text(data.impresora);
            alert("Datos modificados correctamente");
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}



function cierreParaImprimir(id) {

    $.ajax({
        url: "http://localhost:8082/v1/configuracion-imprimir/" + id + "/1",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            if (data == false) {
                alert("Ocurrio un error al realizar la impresión, revisa la conexión de tu impresora o la configuración");
            }
            obtenerCuentasAbiertas();
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}

function cierreParaImprimirSinObtenerCuentas(id) {

    $.ajax({
        url: "http://localhost:8082/v1/configuracion-imprimir/" + id + "/1",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            if (data == false) {
                alert("Ocurrio un error al realizar la impresión, revisa la conexión de tu impresora o la configuración");
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