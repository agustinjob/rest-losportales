function probar() {
    //new Date().getTime() - (new Date().getTimezoneOffset() * 60000)
    var fechatxt = formatoFecha(new Date(), "yy/mm/dd");
    var txtTipoTurno = $("#tipoTurno").val();
    var idTurnotxt = localStorage.getItem("idTurno");
    var estatustxt = $("#tipoVenta").val();

    $.ajax({
        url: "http://localhost:8082/v1/cuentas-ventas",
        type: "POST",
        data: JSON.stringify({
            tipoTurno: txtTipoTurno,
            idTurno: idTurnotxt,
            estatus: estatustxt,
            fecha: fechatxt
        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $("#toBebidas").val(data.bebidas);
            $("#toAlimentos").val(data.alimentos);
            $("#toOtros").val(data.otros);
            $("#ventaTotal").val(data.ventaTotal);
            $("#impuestos").val(data.impuestos);
            $("#descuentos").val(data.descuentos);
            $("#cuenCerradas").val(data.cuentasPagadas);
            $("#cuenAbiertas").val(data.cuentasAbiertas);
            $("#porBebidas").text(data.porcentajeBebidas + " %");
            $("#porAlimentos").text(data.porcentajeAlimentos + " %");
            $("#porOtros").text(data.procentajeOtros + " %");
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}

function formatoFecha(fecha, formato) {
    var txt = (fecha.getMonth() + 1) + "";
    var txt2 = fecha.getDate() + "";
    if (txt.length <= 1) {
        txt = "0" + (fecha.getMonth() + 1);
    }
    if (txt2.length <= 1) {
        txt2 = "0" + fecha.getDate();
    }
    return fecha.getFullYear() + "-" + txt + "-" + txt2;

}

function inicializarDatos() {
    var fechatxt = formatoFecha(new Date(), "yy/mm/dd");
    $("#fechaDia").val(fechatxt);
}