var listaProductos = {};

fetch('productos.json')
    .then(response => response.json())
    .then(data => listaProductos = data)
    .catch(error => console.error('Error:', error));

function cargarProductos() {
    var lista = document.getElementById('listaProductos');
    lista.innerHTML = ''; // Limpiar la lista

    for (var producto in listaProductos) {
        var li = document.createElement('li');
        var img = document.createElement('img');
        img.src = listaProductos[producto].imagen;
        img.alt = producto;
        img.width = "250";
        li.appendChild(img);
        li.appendChild(document.createTextNode(producto + ' - ' + listaProductos[producto].precio + '€'));
        lista.appendChild(li);
    }
}

// Llamar a la función después de cargar los productos
fetch('productos.json')
    .then(response => response.json())
    .then(data => {
        listaProductos = data;
        cargarProductos();
    })
    .catch(error => console.error('Error:', error));
    
    
var costeTotal = 0;
function actualizarCosteTotal() {
    var divCosteTotal = document.getElementById("costeTotal");
    divCosteTotal.textContent = "Coste total: " + costeTotal + "€";
}
function agregarAlCarrito(producto, cantidad = 1) {
    if (producto === undefined) {
        var productoInput = document.getElementById("productoInput");
        var producto = productoInput.value.trim();
        productoInput.value = "";
    } else {
        var parts = producto.split(' ');
        if (parts.length > 1 && !isNaN(parts[0])) {
            cantidad = parseInt(parts[0]);
            producto = parts.slice(1).join(' ');
        } else if (parts.length > 1 && !isNaN(convertirNumeroPalabraANumero(parts[0]))) {
            cantidad = convertirNumeroPalabraANumero(parts[0]);
            producto = parts.slice(1).join(' ');
        }
    }

    console.log('Intentando agregar al carrito: ' + producto);

    var productoEnMinusculas = producto.toLowerCase();
    var productoEnLista = Object.keys(listaProductos).find(key => key.toLowerCase() === productoEnMinusculas || key.toLowerCase() + 's' === productoEnMinusculas);
    if (producto !== "" && productoEnLista) {
        if (!carritoProductos[productoEnLista]) {
            carritoProductos[productoEnLista] = 0;
        }
        carritoProductos[productoEnLista] += cantidad;

        costeTotal += listaProductos[productoEnLista].precio * cantidad;
        actualizarCarrito();
        actualizarCosteTotal();
    } else {
        console.log('Lo sentimos, no encontramos el producto que busca.');
    }
}

var carritoProductos = {};

function actualizarCarrito() {
    var carrito = document.getElementById("carrito");
    carrito.innerHTML = ''; // Limpiar el carrito

    for (var producto in carritoProductos) {
        var li = document.createElement("li");
        li.textContent = producto + ' - ' + carritoProductos[producto];

        var btnEliminarUno = document.createElement("button");
        btnEliminarUno.textContent = "Eliminar uno";
        btnEliminarUno.addEventListener("click", function() {
            eliminarDelCarrito(producto);
        });
        li.appendChild(btnEliminarUno);

        var btnEliminarTodos = document.createElement("button");
        btnEliminarTodos.textContent = "Eliminar todos";
        btnEliminarTodos.addEventListener("click", function() {
            eliminarLosProductos(producto);
        });
        li.appendChild(btnEliminarTodos);

        carrito.appendChild(li);
    }
}

function eliminarDelCarrito(producto) {
    var productoEnMinusculas = producto.toLowerCase();
    var productoEnLista = Object.keys(listaProductos).find(key => key.toLowerCase() === productoEnMinusculas || key.toLowerCase() + 's' === productoEnMinusculas);

    if (producto !== "" && productoEnLista) {
        var carrito = document.getElementById("carrito");
        var items = Array.from(carrito.getElementsByTagName("li"));
        var itemAEliminar = items.find(item => item.textContent.toLowerCase() === productoEnMinusculas);

        if (itemAEliminar) {
            carritoProductos[productoEnLista]--;
            if (carritoProductos[productoEnLista] === 0) {
                delete carritoProductos[productoEnLista];
            }

            costeTotal -= listaProductos[productoEnLista].precio;
            actualizarCarrito();
            actualizarCosteTotal();
        } else {
            console.log('El producto no está en el carrito.');
        }
    }
}
function eliminarLosProductos(producto) {
    if (carritoProductos[producto]) {
        costeTotal -= listaProductos[producto].precio * carritoProductos[producto];
        delete carritoProductos[producto];
        actualizarCarrito();
        actualizarCosteTotal();
    }
}
function eliminarTodoDelCarrito() {
    var carrito = document.getElementById("carrito");
    while (carrito.firstChild) {
        carrito.removeChild(carrito.firstChild);
    }
    costeTotal = 0;
    actualizarCarrito();
    actualizarCosteTotal();
}
function convertirNumeroPalabraANumero(palabra) {
    switch (palabra) {
        case 'una': return 1;
        case 'un': return 1;
        case 'dos': return 2;
        case 'tres': return 3;
        case 'cuatro': return 4;
        case 'cinco': return 5;
        case 'seis': return 6;
        case 'siete': return 7;
        case 'ocho': return 8;
        case 'nueve': return 9;
        case 'diez': return 10;
        // ... add more cases as needed ...
        default: return NaN;
    }
}
// Función para iniciar reconocimiento por voz
function iniciarReconocimientoVoz() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        var microfonoBtn = document.getElementById('microfonoBtn');

        recognition.onstart = function() {
            microfonoBtn.style.backgroundColor = 'lightgreen';
        };
    
        recognition.onend = function() {
            microfonoBtn.style.backgroundColor = '';
        };

        recognition.onresult = function(event) {
            var speechResult = event.results[0][0].transcript;
            console.log('Resultado de reconocimiento de voz: ' + speechResult);
        
            if (speechResult.toLowerCase().startsWith('añade')) {
                var parts = speechResult.slice(6).split(' ');
                var cantidad = convertirNumeroPalabraANumero(parts[0]);
                var producto = parts.slice(1).join(' ');
                if (isNaN(cantidad)) {
                    // If the first part is not a number, assume the quantity is 1 and the product is the whole string
                    cantidad = 1;
                    producto = parts.join(' ');
                }
                agregarAlCarrito(producto, cantidad);
            } else if (speechResult.toLowerCase().startsWith('elimina todo')) {
                eliminarTodoDelCarrito();
            } else if (speechResult.toLowerCase().startsWith('elimina')) {
                eliminarDelCarrito(speechResult.slice(8));
            }
        };
        recognition.onerror = function(event) {
            console.log('Error de reconocimiento de voz: ' + event.error);
        };

        recognition.start();
    } else {
        alert('Tu navegador no soporta reconocimiento de voz.');
    }
}
// Añadir un event listener al botón de microfono
document.getElementById("microfonoBtn").addEventListener("click", iniciarReconocimientoVoz);