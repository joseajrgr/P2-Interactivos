function registrarUsuario() {
    // Obtener los valores del formulario
    var tipoUsuario = document.getElementById("tipoUsuario").value;
    var nombreUsuario = document.getElementById("nombreUsuario").value;
    var contraseña = document.getElementById("contraseña").value;


    console.log("Tipo de usuario:", tipoUsuario);
    console.log("Nombre de usuario:", nombreUsuario);
    console.log("Contraseña:", contraseña);

    if (tipoUsuario == "cliente") {
        window.location.href = "cliente.html";
    } else if (tipoUsuario == "encargado") {
        window.location.href = "encargado.html";
    }
}
