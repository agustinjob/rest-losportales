function traerTurnos() {

    var fecha = $("#fecha").val();
    console.log("http://localhost:8082/v1/turnos-dia/" + fecha);
    $.ajax({
        url: "http://localhost:8082/v1/turnos-dia/" + fecha,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            var option = "<option value='0'>Selecciona un turno</option>";
            $.each(data, function(i, item) {
                if (item.fechaCierre === null) {
                    option = option + "\n <option value=\"" + item.idTurno + "\"> PRE </option>";
                } else {
                    option = option + "\n <option value=\"" + item.idTurno + "\">" + (i + 1) + "</option>";
                }
            });
            $("#divTurno").html('<select class="form-control" onchange="enviaTurno();" id="turnos">' + option + '</select>');
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}

function enviaTurno() {
    var idTurno = $("#turnos").val();
    $.ajax({
        url: "http://localhost:8082/v1/cuentas-corte/" + idTurno,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {

            $("#datCorte").html(data);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}