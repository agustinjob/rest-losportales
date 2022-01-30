function abrirTurno() {
    var idTurno = localStorage.getItem('idTurno');

    if (idTurno == null) {
        var fecha = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000));
        var idUsuariotxt = localStorage.getItem('idUsuario');
        var fondoInicialtxt = $("#turnoFondoInicial").val();
        if (fondoInicialtxt == "") {
            alert("Ingresa una cantidad por favor");
            return null;
        }
        $.ajax({
            url: "http://localhost:8082/v1/turnos",
            type: "POST",
            data: JSON.stringify({
                fechaApertura: fecha,
                fechaCierre: "",
                fondoInicial: fondoInicialtxt,
                usuario: idUsuariotxt,
                estatus: "abierto",
                efectivoDeclarado: 0
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                localStorage.setItem("idTurno", data.idTurno);
                alert('Registro agregado exitosamente !!!');
                $("#turnoFondoInicial").val("");
            },
            failure: function(data) {
                alert(data.responseText);
            },
            error: function(data) {
                alert(data.responseText);
            }
        });
    } else {

        alert("Ya hay un turno abierto, no puedes tener dos turnos abiertos a la vez");
    }
}

function cerrarTurno() {
    var idTurnotxt = localStorage.getItem('idTurno');

    if (idTurnotxt != null) {
        var fecha = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000));

        var fondoDeclaradotxt = $("#turnoFondoDeclarado").val();
        $.ajax({
            url: "http://localhost:8082/v1/turnos",
            type: "PUT",
            data: JSON.stringify({
                idTurno: idTurnotxt,
                fechaCierre: fecha,
                efectivoDeclarado: fondoDeclaradotxt
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                localStorage.removeItem("idTurno");
                $("#turnoFondoDeclarado").val("");
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

        alert("No puedes cerrar si no haz abierto ningún turno");
        $("#turnoFondoDeclarado").val("");
    }
}

function buscarTurno() {
    //  var idTurno = localStorage.getItem('idTurno');


    $.ajax({
        url: "http://localhost:8082/v1/turnos-estatus",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $.each(data, function(i, item) {
                console.log(item.idTurno);
                localStorage.setItem("idTurno", item.idTurno);
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