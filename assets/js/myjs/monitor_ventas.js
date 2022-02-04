function probar() {
    //new Date().getTime() - (new Date().getTimezoneOffset() * 60000)
    var fechatxt = formatoFecha(new Date(), "yy/mm/dd");
    console.log(fechatxt);

    $.ajax({
        url: "http://localhost:8082/v1/cuentas-ventas",
        type: "POST",
        data: JSON.stringify({
            tipoTurno: "todos",
            idTurno: "61fa08864297c65737d3b5e0",
            estatus: "abierta",
            fecha: fechatxt

        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
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