function revisarSesion() {
    console.log("ingreso a revisar sesión")
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("password");

    if (user == null || pass == null) {
        location.href = "index.html"
    }
}