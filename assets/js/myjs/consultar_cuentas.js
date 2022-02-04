var cuentasGlobal = [];

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