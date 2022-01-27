function almacenar() {

    var operacion = $("#btnAlmacenar").text();
    var nom = $("#nombre").val();
    var cel = $("#celular").val();
    var esta = "vigente"; // AL insertar siempre es vigente

    //  console.log(nom + " " + user + " " + pass + " " + tipU);
    if (nom == "" || cel == "") {
        alert("Completa la información por favor");
        return null;
    }

    if (operacion == "REGISTRAR") {
        $.ajax({
            url: "http://localhost:8082/v1/meseros",
            type: "POST",
            data: JSON.stringify({
                nombre: nom,
                celular: cel,
                estatus: esta
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
            url: "http://localhost:8082/v1/meseros",
            type: "PUT",
            data: JSON.stringify({
                id: localStorage.getItem("ids"),
                nombre: nom,
                celular: cel,
                estatus: esta
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

function modificar(ids, nombretxt, celulartxt, operacion) {

    if (operacion == "eliminar") {

        $.ajax({
            url: "http://localhost:8082/v1/meseros",
            type: "POST",
            data: JSON.stringify({
                id: ids,
                nombre: nombretxt,
                celular: celulartxt,
                estatus: "eliminado"
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
        $("#nombre").val(nombretxt);
        $("#celular").val(celulartxt);
        localStorage.setItem("ids", ids);
    }
}


function obtenerDatos() {

    $.ajax({
        url: "http://localhost:8082/v1/meseros",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $('#tablaMeseros > tbody').empty();
            $.each(data, function(i, item) {
                var rows =
                    "<tr>" +
                    "<td>" + item.nombre + "</td>" +
                    "<td>" + item.celular + "</td>" +
                    "<td class='text-center'> <button class='btn bg-danger btn-round' onclick=\"modificar(\'" + item.id + "\',\'" + item.nombre + "\',\'" + item.celular + "\',\'eliminar\');\" ><i class='zmdi zmdi-delete'></i></button> " +
                    "<button class='btn bg-success btn-round' onclick=\"modificar(\'" + item.id + "\',\'" + item.nombre + "\',\'" + item.celular + "\',\'modificar\');\" ><i class='zmdi zmdi-edit'></button></td>" +
                    "</tr>";
                $('#tablaMeseros > tbody').append(rows);
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
    $("#nombre").val("");
    $("#celular").val("");
    localStorage.removeItem("ids");
    $("#btnAlmacenar").text("REGISTRAR");
}