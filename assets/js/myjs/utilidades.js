function revisarSesion() {
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("password");

    if (user == null || pass == null) {
        location.href = "index.html"
    }
}

function eliminarCuenta() {
    localStorage.removeItem("idCuenta");
}

function cerrarModal(modal) {
    $("#" + modal).modal('hide');
}

function limpiarCampoInput(id) {
    $("#" + id).val("");
}

function revisarSiHayTurnoAbierto(modal, mensaje) {
    idTurno = localStorage.getItem("idTurno");
    if (idTurno === null) {
        $("#" + modal).modal('show');

    }
    alert(mensaje);

}

function verificarPass(modal) {

    var pass = $("#password").val();
    var passEncrip = CryptoJS.MD5(pass);
    var encrip = localStorage.getItem("password");
    console.log(pass);
    console.log(passEncrip);
    if (passEncrip == encrip) {
        $("#password").val("");
        $("#" + modal).modal('show');
        cerrarModal("valDesModal");
    } else {
        alert("Datos incorrectos");
    }

}

function limpiarDatosInicioSesion() {
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("user");
    localStorage.removeItem("tipoUsuario");
    localStorage.removeItem("password");
    localStorage.removeItem("idTurno");
}

function abrirModal(modal) {
    $("#" + modal).modal('show');
}

function agregarClase(id) {
    $("#" + id).addClass("deshabilitarDiv");
}

function quitarClase(id) {
    $("#" + id).removeClass("deshabilitarDiv");
}