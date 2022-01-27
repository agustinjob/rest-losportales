function revisarSesion() {
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("password");

    if (user == null || pass == null) {
        location.href = "index.html"
    }
}