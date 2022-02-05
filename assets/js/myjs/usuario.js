    function almacenar() {

        var operacion = $("#btnAlmacenar").text();
        var nom = $("#nombre").val();
        var user = $("#username").val();
        var pass = $("#password").val();
        var tipU = $("#tipoUsuario").val();
        var esta = "vigente"; // AL insertar siempre es vigente
        var fech = new Date();

        //  console.log(nom + " " + user + " " + pass + " " + tipU);
        if (nom == "" || user == "" || pass == "" || tipU == "") {
            // alert("Completa la información por favor");
            toastr["info"]("", "Completa la información por favor");

            
              
     

            return null;
        }
        

        if (operacion == "REGISTRARSE") {
            $.ajax({
                url: "http://localhost:8082/v1/usuarios",
                type: "POST",
                data: JSON.stringify({
                    nombre: nom,
                    username: user,
                    password: pass,
                    tipoUsuario: tipU,
                    fechaRegistro: fech,
                    estatus: esta
                }),
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
                    limpiar();
                    obtenerDatos();
                    // alert('Registro agregado exitosamente !!!');
                    toastr["success"]("", "¡¡¡Registro agregado exitosamente!!!")
     
                },
                failure: function(data) {
                    alert(data.responseText);
                },
                error: function(data) {
                    toastr["error"]("", "¡¡¡Error!!!")
             
                    // alert(data.responseText);
                }
            });
        } else {
            $.ajax({
                url: "http://localhost:8082/v1/usuarios",
                type: "POST",
                data: JSON.stringify({
                    id: localStorage.getItem("ids"),
                    nombre: nom,
                    username: user,
                    password: pass,
                    tipoUsuario: tipU,
                    fechaRegistro: localStorage.getItem("fecha"),
                    estatus: esta
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

    function modificar(ids, nom, user, tipU, fech, pass, operacion) {

        if (operacion == "eliminar") {

            $.ajax({
                url: "http://localhost:8082/v1/usuarios",
                type: "POST",
                data: JSON.stringify({
                    id: ids,
                    nombre: nom,
                    username: user,
                    password: pass,
                    tipoUsuario: tipU,
                    fechaRegistro: fech,
                    estatus: "eliminado"
                }),
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
                    console.log(data);
                    toastr["success"]("", "¡¡¡Eliminado correctamente!!!")

                    // alert("Eliminado correctamente");
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
            $("#nombre").val(nom);
            $("#username").val(user);
            $("#password").val(pass);
            $("#tipoUsuario").val(tipU);
            $("#tipoUsuario").selectpicker('refresh');
            
            localStorage.setItem("ids", ids);
            localStorage.setItem("fecha", fech)
        }
    }


    function obtenerDatos() {

        $.ajax({
            url: "http://localhost:8082/v1/usuarios",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#tablaUsuarios > tbody').empty();
                $.each(data, function(i, item) {
                    // if(item.estatus != "eliminado" ){
                    var rows =
                        "<tr>" +
                        "<td>" + item.nombre + "</td>" +
                        "<td>" + item.username + "</td>" +
                        "<td>" + item.tipoUsuario + "</td>" +
                        "<td class='text-center';>  <button class='btn bg-danger btn-icon  btn-icon-mini btn-round' onclick=\"modificar(\'" +
                         item.id + "\',\'" + item.nombre + "\',\'" + item.username + "\',\'" + item.tipoUsuario + "\',\'" +
                         item.fechaRegistro + "\',\'" + item.password + "\',\'eliminar\');\" ><i class='zmdi zmdi-delete'></i></button> " +
                        "<button class='btn bg-success btn-icon  btn-icon-mini btn-round' onclick=\"modificar(\'" + item.id + "\',\'" +
                        item.nombre + "\',\'" + item.username + "\',\'" + item.tipoUsuario + "\',\'" + 
                        item.fechaRegistro + "\',\'" + item.password + "\',\'modificar\');\" ><i class='zmdi zmdi-edit'></i></button></td>" +
                        "</tr>";
                    
                    $('#tablaUsuarios > tbody').append(rows);
                    // }   else{
                        
                    // }
                  

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
        $("#username").val("");
        $("#password").val(""); //falta setear el select
        $("#tipoUsuario").val('Administrador');

        localStorage.removeItem("ids");
        localStorage.removeItem("fecha");
        $("#btnAlmacenar").text("REGISTRARSE");
    }