function almacenar() {

    var operacion = $("#btnAlmacenar").text();

    var nombretxt = $("#nombre").val();
    var categoriatxt = $("#categoria").val();


    //  console.log(nom + " " + user + " " + pass + " " + tipU);
    if (nombretxt == "") {
        // alert("Completa la información por favor");
        toastr["info"]("", "Completa la información por favor");
        return null;
    }

    if (operacion == "REGISTRAR") {
        $.ajax({
            url: "http://localhost:8082/v1/categorias",
            type: "POST",
            data: JSON.stringify({
                nombre: nombretxt,
                categoria: categoriatxt
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                limpiar();
                obtenerDatos();
                // alert('Registro agregado exitosamente !!!')
                toastr["success"]("", "¡¡¡Registro agregado exitosamente!!!")
                ;
            },
            failure: function(data) {
                alert(data.responseText);
            },
            error: function(data) {
                // alert(data.responseText);
                toastr["error"]("", "¡¡¡Error!!!")

            }
        });
    } else {
        $.ajax({
            url: "http://localhost:8082/v1/categorias",
            type: "PUT",
            data: JSON.stringify({
                id: localStorage.getItem("ids"),
                nombre: nombretxt,
                categoria: categoriatxt
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                limpiar();

                // alert('Registro modificado exitosamente !!!');
                toastr["success"]("", "¡¡¡Registro modificado exitosamente!!!")

                obtenerDatos();
            },
            failure: function(data) {
                alert(data.responseText);
            },
            error: function(data) {
                // alert(data.responseText);
                toastr["error"]("", "¡¡¡Error!!!")

            }
        });
    }

}

function modificar(ids, nombretxt, categoriatxt, operacion) {

    if (operacion == "eliminar") {

        $.ajax({
            url: "http://localhost:8082/v1/categorias",
            type: "DELETE",
            data: JSON.stringify({
                id: ids,
                nombre: nombretxt,
                categoria: categoriatxt
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                // alert("Eliminado correctamente");
                toastr["success"]("", "¡¡¡Eliminado correctamente!!!")

                obtenerDatos();
            },
            failure: function(data) {
                alert(data.responseText);
            },
            error: function(data) {
                // alert(data.responseText);
                toastr["error"]("", "¡¡¡Error!!!")

            }
        });
    } else {

        $("#btnAlmacenar").text("MODIFICAR");
        $("#nombre").val(nombretxt);
        $("#categoria").val(categoriatxt);
        localStorage.setItem("ids", ids);
    }
}


function obtenerDatos() {

    $.ajax({
        url: "http://localhost:8082/v1/categorias",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $('#tablaCategorias > tbody').empty();
            $.each(data, function(i, item) {
                var rows =
                    "<tr>" +
                    "<td>" + item.nombre + "</td>" +
                    "<td>" + item.categoria + "</td>" +
                    "<td class='text-center';> <button class='btn bg-danger btn-icon  btn-icon-mini btn-round'  onclick=\"modificar(\'" + item.id + "\',\'" + item.nombre + "\',\'" + item.categoria + "\',\'eliminar\');\" ><i class='zmdi zmdi-delete'></i></button> " +
                    "<button class='btn bg-success btn-icon  btn-icon-mini btn-round' onclick=\"modificar(\'" + item.id + "\',\'" + item.nombre + "\',\'" + item.categoria + "\',\'modificar\');\" ><i class='zmdi zmdi-edit'></i></button></td>" +
                    "</tr>";
                $('#tablaCategorias > tbody').append(rows);
            });
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            // alert(data.responseText);
            toastr["error"]("", "¡¡¡Error!!!")

        }
    });

}





function limpiar() {
    $("#nombre").val("");
    $("#categoria").val("");
    localStorage.removeItem("ids");
    $("#btnAlmacenar").text("REGISTRAR");


}