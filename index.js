function addItem() {
    var ul = document.getElementById("listaCompra");
    var item = document.getElementById("itemInput");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(item.value));
    ul.appendChild(li);
    item.value = "";
}
