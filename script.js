function agregarAlCarrito() {
    var productoInput = document.getElementById("productoInput");
    var producto = productoInput.value.trim();
    if (producto !== "") {
        var carrito = document.getElementById("carrito");
        var li = document.createElement("li");
        li.textContent = producto;
        carrito.appendChild(li);
        productoInput.value = "";
    }
}
