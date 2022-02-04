var cuentasArray = [];
var cuentasIdsArray = [];
var importeAPagar = 0;

function buscarPropinasNoPagadas() {

    var idTurno = localStorage.getItem('idTurno');
    var tipo = $("#tipoBusquedaPropina").val();
    var idMesero = $("#idMeseroPropina").val();

    if (tipo === "0" || idMesero === "0") {
        alert("Por favor seleccionas las opciones correspondiente");
        return null;
    }

    $.ajax({
        url: "http://localhost:8082/v1/cuentas-propinas/" + idTurno + "/" + tipo + "/" + idMesero,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            if (data.length <= 0) {
                alert("No se encontraron datos");
                return null;
            }
            cuentasArray = data;
            $('#tablaPropinas > tbody').empty();
            $("#numCuentas").val(data.length);
            var total = 0;
            $.each(data, function(i, item) {
                var totalTC = item.propinaVisa + item.propinaMasterCard + item.propinaAmericanExpress;
                var totalPropina = 0;
                totalPropina = totalPropina + totalTC + item.propinaEfectivo;
                total = total + totalPropina;
                var rows =
                    "<tr>" +
                    "<td>" + item.folio + "</td>" +
                    "<td>" + item.cierre + "</td>" +
                    "<td>" + item.orden + "</td>" +
                    "<td>" + item.propinaEfectivo + "</td>" +
                    "<td>" + totalTC + "</td>" +
                    "<td>" + (totalTC + item.propinaEfectivo) + "</td>" +
                    "<td class='text-center'> <button id='btnAsiPro" + i + "' class='btn bg-success  btn-icon-mini btn-round' onclick=\"asignarPropina(\'" + item.idCuenta + "\'," + i + "," + totalPropina + ");\" ><i class='zmdi zmdi-delete'></i></button> " +
                    "</tr>";
                $('#tablaPropinas > tbody').append(rows);
            });
            $("#importeTotalPropinas").val(total);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}

function asignarPropina(id, posicion, propinaTotal) {
    $("#btnAsiPro" + posicion).prop('disabled', true);
    cuentasIdsArray.push(id);
    importeAPagar = importeAPagar + propinaTotal;
    $("#importeAPagar").val(importeAPagar);

}

function limpiarTodo() {
    cuentasArray = [];
    cuentasIdsArray = [];
    importeAPagar = 0;
    $("#importeAPagar").val(0);
    $("#importeTotalPropinas").val(0);
    $('#tablaPropinas > tbody').empty();
    $("#numCuentas").val(0);

}

function propinasActualizar() {
    if (importeAPagar <= 0) {
        alert("Por favor selecciona alguna cuenta a pagar");
    } else {
        $.ajax({
            url: "http://localhost:8082/v1/propinas-actualizar",
            type: "POST",
            data: JSON.stringify({
                listaIds: cuentasIdsArray
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                if (data === true) {
                    var mesero = $("#idMeseroPropina option:selected").text();
                    var importe = $("#importeAPagar").val();
                    imprimirGastos("PAGO PROPINA", importe, mesero);
                    alert("Datos modificados correctamente");
                } else {
                    alert("Ocurrio un error no se modificaron los datos correctamente, revisa la información");
                }
                limpiarTodo();

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