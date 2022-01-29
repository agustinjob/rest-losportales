var productosArray;
var productosSeleccionados = [];
var productoSeleccionado = "";

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

    var ProductoCuenta = {
        id: item.id,
        nombre: item.nombre,
        cantidad: 1,
        costo: item.precio,
        importe: item.costo,
        motivoCancelacion: "",
        catEspecifica: item.categoriaEspecifica,
        catGeneral: item.categoriaGeneral
    };

    var objPro = productosSeleccionados.find(product => product.id === item.id);
    if (objPro == undefined) {
        productosSeleccionados.push(ProductoCuenta);
        productoSeleccionado = ProductoCuenta.id;
        var rows =
            "<tr>" +
            "<td><a style='cursor:pointer;' onclick=\"seleccionarProducto(\'" + ProductoCuenta.id + "\'); \">" + ProductoCuenta.nombre + "</a></td>" +
            "<td>" + ProductoCuenta.cantidad + "</td>" +
            "<td>" + ProductoCuenta.costo + "</td>" +
            "<td>" + ProductoCuenta.costo + "</td><tr>";
        $("#tablaProductosSeleccionados > tbody").append(rows);
    } else {
        //  objPro.cantidad = objPro.cantidad + 1;
    }

}

function eliminarTodo() {
    $("#tablaProductosSeleccionados > tbody").empty();
    productosSeleccionados = [];
    productoSeleccionado = "";

}

function eliminarUno() {
    if (productoSeleccionado == "") {
        alert("Tienes que seleccionar un producto para eliminar");
    } else {

        for (var i = 0; i < productosSeleccionados.length; i++) {

            if (productosSeleccionados[i].id === productoSeleccionado) {
                productosSeleccionados.splice(i, 1);

                break;
            }
        }
        mostrarTablaActualizada();
    }
}

function sumarRestar(opcion) {
    var objPro = productosSeleccionados.find(product => product.id === productoSeleccionado);

    if (opcion == 1) {
        objPro.cantidad = objPro.cantidad + 1;

    } else {
        if (objPro.cantidad <= 1) {
            alert("No se puede restar uno, la cantidad quedaria en cero");
        } else {
            objPro.cantidad = objPro.cantidad - 1;
        }
    }

    mostrarTablaActualizada();

}

function seleccionarProducto(idProd) {
    productoSeleccionado = idProd;

}



function mostrarTablaActualizada() {
    $("#tablaProductosSeleccionados > tbody").empty();
    for (var i = 0; i < productosSeleccionados.length; i++) {

        var rows =
            "<tr>" +
            "<td><a style='cursor:pointer;' onclick=\"seleccionarProducto(\'" + productosSeleccionados[i].id + "\'); \">" + productosSeleccionados[i].nombre + "</a></td>" +
            "<td>" + productosSeleccionados[i].cantidad + "</td>" +
            "<td>" + productosSeleccionados[i].costo + "</td>" +
            "<td>" + (productosSeleccionados[i].costo * productosSeleccionados[i].cantidad) + "</td><tr>";
        productosSeleccionados[i].importe = (productosSeleccionados[i].costo * productosSeleccionados[i].cantidad);

        $("#tablaProductosSeleccionados > tbody").append(rows);
    }
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

function agregarProductos() {

    var idCuentatxt = localStorage.getItem("idCuenta");
    $.ajax({
        url: "http://localhost:8082/v1/cuentas-cambiar/3",
        type: "POST",
        data: JSON.stringify({
            idCuenta: idCuentatxt,
            productos: productosSeleccionados
        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            $("#cuentaInfo").val(data.nombreCuenta);
            alert('Productos agregados correctamente!!!');
            location.href = "servicio_comedor.html";
        },
        failure: function(data) {
            alert(data.responseText);
        },
        error: function(data) {
            alert(data.responseText);
        }
    });
}