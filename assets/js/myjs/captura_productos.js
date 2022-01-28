var productosArray;
var productosSeleccionados = [];
var productoSeleccionado;

function buscarProductosPorCategorias() {
    //"/productos-cate/{categoriaGeneral}/{categoriaEspecifica}"
    var idTurno = localStorage.getItem('idTurno');
    if (idTurno == null) {
        alert("No haz abierto cuenta, no podras ver los datos");
    } else {
        // console.log("http://localhost:8082/v1/cuentas/" + idTurno + "/abierta");
        $.ajax({
            url: "http://localhost:8082/v1/cuentas/" + idTurno + "/abierta",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#tablaCuentas > tbody').empty();
                $.each(data, function(i, item) {
                    var rows =
                        "<tr>" +
                        "<td><a onclick='datosCuenta(\"" + item.idCuenta + "\")' style='cursor:pointer;' >" + item.nombreCuenta + "</a></td>" +
                        "<td>" + item.impreso + "</td>" +
                        "<td>" + item.nombreMesero + "</td>" +
                        "<td>" + item.orden + "</td>" +
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
}


function obtenerDatosCategorias(categoriaGeneral) {

    $.ajax({
        url: "http://localhost:8082/v1/categorias-cate/" + categoriaGeneral,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            var datos = "";
            $.each(data, function(i, item) {

                datos = datos + '<div id = "caja" >' +
                    '<button type = "button" class = "btnMenu l-amber " >' +
                    '<a onclick="productosPorCategoria(\'' + categoriaGeneral + '\',\'' + item.nombre + '\');"><p class = "negro-text"> <strong> ' + item.nombre + ' </strong> </p>' +
                    '</a> </button> </div> \n';
            });
            $("#listaCategoriasEspecificas").html(datos);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}

function productosPorCategoria(categoriageneraltxt, categoriaespecificatxt) {

    $.ajax({
        url: "http://localhost:8082/v1//productos-cate/" + categoriageneraltxt + "/" + categoriaespecificatxt,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            var rows = "";
            $.each(data, function(i, item) {
                rows = rows + '  <div id="caja">' +
                    '<button type = "button" class = "btnMenu btn-color-naranja2">' +
                    '<p> <strong> ' + item.nombre + ' </strong>  </p>' +
                    '</button> </div>';
            });
            $('#listaProductos').html(rows);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}

function agregarProductoTabla(posicion) {
    var item = productosArray[posicion];
    productosSeleccionados.push(item);
    var rows =
        "<tr>" +
        "<td><a style='cursor:pointer;' onclick=\"seleccionarProducto(\'" + item.id + "\'); \">" + item.nombre + "</a></td>" +
        "<td>1</td>" +
        "<td>" + item.precio + "</td>" +
        "<td>" + item.precio + "</td><tr>";
    $("#tablaProductosSeleccionados > tbody").append(rows);
}

function sumarEliminar(opcion) {
    var objPro = productosSeleccionados.find(produc => product.id === productoSeleccionado);

    if(opcion==1){
objPro.cant
    }else{

    }

}

function seleccionarProducto(idProd) {
    productoSeleccionado = idProd;
    console.log(productoSeleccionado);
}



function mostrarTablaActualizada() {

}

function productosTodos() {

    $.ajax({
        url: "http://localhost:8082/v1/productos",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            var rows = "";
            productosArray = data;
            $.each(data, function(i, item) {
                rows = rows + '  <div id="caja">' +
                    '<button onclick=\"agregarProductoTabla(\'' + i + '\');\" type = "button" class = "btnMenu btn-color-naranja2">' +
                    '<p> <strong> ' + item.nombre + ' </strong>  </p>' +
                    '</button> </div>';
            });
            $('#listaProductos').html(rows);
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });

}