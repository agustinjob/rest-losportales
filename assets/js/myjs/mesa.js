function almacenar() {

    var operacion = $("#btnAlmacenar").text();
    console.log(operacion);
    var mesatxt = $("#mesa").val();


    //  console.log(nom + " " + user + " " + pass + " " + tipU);
    if (mesatxt == "") {
        alert("Completa la información por favor");
        return null;
    }

    if (operacion == "REGISTRAR") {
        $.ajax({
            url: "http://localhost:8082/v1/mesas",
            type: "POST",
            data: JSON.stringify({
                mesa: mesatxt
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                limpiar();
                obtenerDatos();
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
        $.ajax({
            url: "http://localhost:8082/v1/mesas",
            type: "PUT",
            data: JSON.stringify({
                id: localStorage.getItem("ids"),
                mesa: mesatxt
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                limpiar();

                alert('Registro modificado exitosamente !!!');
                obtenerDatos();
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

function modificar(ids, mesatxt, operacion) {

    if (operacion == "eliminar") {

        $.ajax({
            url: "http://localhost:8082/v1/mesas",
            type: "DELETE",
            data: JSON.stringify({
                id: ids,
                mesa: mesatxt
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                alert("Eliminado correctamente");
                obtenerDatos();
            },
            failure: function(data) {
                alert(data.responseText);
            },
            error: function(data) {
                alert(data.responseText);
            }
        });
    } else {

        $("#btnAlmacenar").text("MODIFICAR");
        $("#mesa").val(mesatxt);
        localStorage.setItem("ids", ids);
    }
}


function obtenerDatos() {

    $.ajax({
        url: "http://localhost:8082/v1/mesas",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $('#tablaMesas > tbody').empty();
            $.each(data, function(i, item) {
                var rows =
                    "<tr>" +
                    "<td>" + item.mesa + "</td>" +
                    "<td class='text-center';> <button class='btn bg-danger btn-round' onclick=\"modificar(\'" + item.id + "\',\'" + item.mesa + "\',\'eliminar\');\" ><i class='zmdi zmdi-delete'></i></button> " +
                    "<button class='btn bg-success btn-round' onclick=\"modificar(\'" + item.id + "\',\'" + item.mesa + "\',\'modificar\');\" ><i class='zmdi zmdi-edit'></i></button></td>" +
                    "</tr>";
                $('#tablaMesas > tbody').append(rows);
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



function limpiar() {
    $("#mesa").val("");
    localStorage.removeItem("ids");
    $("#btnAlmacenar").text("REGISTRAR");


}