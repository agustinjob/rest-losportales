function almacenar() {

    var operacion = $("#btnAlmacenar").text();
    var nombretxt = $("#nombre").val();
    var categoriageneraltxt = $("#categoriaGeneral").val();
    var categoriaespecificatxt = $("#categoriaEspecifica").val();
    var preciotxt = $("#precio").val();
    var ivatxt = $("#iva").val();


    //  console.log(nom + " " + user + " " + pass + " " + tipU);
    // Revisar que sean números igual u obligar que solo puedan meter números
    if (nombretxt == "" || categoriageneraltxt == "" || categoriaespecificatxt == "" || preciotxt == "" || ivatxt == "") {
        alert("Completa la información por favor");
        return null;
    }

    if (operacion == "REGISTRAR") {
        $.ajax({
            url: "http://localhost:8082/v1/productos",
            type: "POST",
            data: JSON.stringify({
                nombre: nombretxt,
                categoriaGeneral: categoriageneraltxt,
                categoriaEspecifica: categoriaespecificatxt,
                precio: preciotxt,
                iva: ivatxt,
                estatus: "vigente"
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
            url: "http://localhost:8082/v1/productos",
            type: "PUT",
            data: JSON.stringify({
                id: localStorage.getItem("ids"),
                nombre: nombretxt,
                categoriaGeneral: categoriageneraltxt,
                categoriaEspecifica: categoriaespecificatxt,
                precio: preciotxt,
                iva: ivatxt,
                estatus: "vigente"
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

function modificar(ids, nombretxt, categoriageneraltxt, categoriaespecificatxt, preciotxt, ivatxt, operacion) {

    if (operacion == "eliminar") {

        $.ajax({
            url: "http://localhost:8082/v1/productos",
            type: "DELETE",
            data: JSON.stringify({
                id: ids,
                nombre: nombretxt,
                categoriaGeneral: categoriageneraltxt,
                categoriaEspecifica: categoriaespecificatxt,
                precio: preciotxt,
                iva: ivatxt,
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
        $("#categoriaGeneral").val(categoriageneraltxt);
        $("#categoriaEspecifica").val(categoriaespecificatxt);
        $("#precio").val(preciotxt);
        $("#iva").val(ivatxt);
        localStorage.setItem("ids", ids);
    }
}


function obtenerDatos() {

    $.ajax({
        url: "http://localhost:8082/v1/productos",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $('#tablaProductos > tbody').empty();
            $.each(data, function(i, item) {
                var rows =
                    "<tr>" +
                    "<td>" + item.nombre + "</td>" +
                    "<td>" + item.categoriaGeneral + "</td>" +
                    "<td>" + item.categoriaEspecifica + "</td>" +
                    "<td>" + item.precio + "</td>" +
                    "<td>" + item.iva + "</td>" +
                    "<td class='text-center'> <button class='btn bg-danger btn-round' onclick=\"modificar(\'" + item.id + "\',\'" + item.nombre + "\',\'" + item.categoriaGeneral + "\',\'" + item.categoriaEspecifica + "\',\'" + item.precio + "\',\'" + item.iva + "\',\'eliminar\');\" ><i class='zmdi zmdi-delete'></i></button> " +
                    "<button class='btn bg-success btn-round' onclick=\"modificar(\'" + item.id + "\',\'" + item.nombre + "\',\'" + item.categoriaGeneral + "\',\'" + item.categoriaEspecifica + "\',\'" + item.precio + "\',\'" + item.iva + "\',\'modificar\');\" ><i class='zmdi zmdi-edit'></i></button></td>" +
                    "</tr>";
                $('#tablaProductos > tbody').append(rows);
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
    $("#categoria").val("");
    localStorage.removeItem("ids");
    $("#btnAlmacenar").text("REGISTRAR");


}

function datosCategoria() {
    var categoriageneraltxt = $("#categoriaGeneral").val();
    // $("#categoriaEspecifica").prop("disabled", "false");

    $.ajax({
        url: "http://localhost:8082/v1/categorias-cate/" + categoriageneraltxt,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $('#categoriaEspecifica').empty();
            var rows = "";
            $.each(data, function(i, item) {
                rows = rows + "\n <option value=\"" + item.nombre + "\">" + item.nombre + "</option>";
            });
            $('#divcatespe').html('<select class="form-control show-tick"  id="categoriaEspecifica">' + rows + '</select>');
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}