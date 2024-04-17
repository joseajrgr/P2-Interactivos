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
    
            // Texto del producto
            var divTexto = document.createElement('div');
            divTexto.className = 'producto-texto';
            divTexto.textContent = producto + ' - ' + listaProductos[producto].precio + '€';
            li.appendChild(divTexto);
    
            // Estrellas generadas aleatoriamente
            var divEstrellas = document.createElement('div');
            divEstrellas.className = 'producto-estrellas';
            divEstrellas.innerHTML = generarEstrellasAleatorias();
            li.appendChild(divEstrellas);
    
            // Imagen del producto
            var divImagen = document.createElement('div');
            divImagen.className = 'producto-imagen';
            var img = document.createElement('img');
            img.src = listaProductos[producto].imagen;
            img.alt = producto;
            img.width = "250";
            divImagen.appendChild(img);
            li.appendChild(divImagen);
    
            // Botón de "Comprar"
            var divBoton = document.createElement('div');
            divBoton.className = 'producto-boton';
            var btnComprar = document.createElement('button');
            btnComprar.textContent = "Comprar";
            // Asegúrate de que el evento de clic se asigne correctamente
            btnComprar.addEventListener('click', (function(prod) {
                return function() {
                    agregarAlCarrito(prod);
                };
            })(producto));
            divBoton.appendChild(btnComprar);
            li.appendChild(divBoton);
    
            lista.appendChild(li);
        }
    }

    function generarEstrellasAleatorias() {
        var estrellas = '';
        var numEstrellas = Math.floor(Math.random() * 4) + 1; // Genera un número aleatorio de 1 a 4
    
        for (var i = 0; i < numEstrellas; i++) {
            estrellas += '★ '; // Añade una estrella al string
        }
    
        return estrellas;
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
    // Inicializa el coste total a 0
    costeTotal = 0;

    // Recorre todos los productos en el carrito
    for (var producto in carritoProductos) {
        // Suma el coste de cada producto al coste total
        // Asegúrate de que listaProductos[producto].precio contenga el precio correcto del producto
        costeTotal += listaProductos[producto].precio * carritoProductos[producto];
    }

    // Actualiza el texto del elemento que muestra el coste total
    var divCosteTotal = document.getElementById("costeTotal");
    divCosteTotal.textContent = "Coste total: " + costeTotal.toFixed(2) + "€";
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
        li.textContent = producto + ' - ';

        // Botón para quitar 1
        var btnQuitarUno = document.createElement("button");
        btnQuitarUno.textContent = "-";
        btnQuitarUno.className = "carrito-btn carrito-btn-minus"; // Asignar clase
        btnQuitarUno.addEventListener("click", (function(prod) {
            return function() {
                eliminarDelCarrito(prod);
            };
        })(producto));
        li.appendChild(btnQuitarUno);

        // Mostrar cantidad
        li.appendChild(document.createTextNode(carritoProductos[producto]));

        // Botón para añadir 1
        var btnAñadirUno = document.createElement("button");
        btnAñadirUno.textContent = "+";
        btnAñadirUno.className = "carrito-btn carrito-btn-plus"; // Asignar clase
        btnAñadirUno.addEventListener("click", (function(prod) {
            return function() {
                agregarAlCarrito(prod, 1); // Asegúrate de que esta función actualice correctamente la cantidad
            };
        })(producto));
        li.appendChild(btnAñadirUno);

        // Botón para quitar todos
        var btnQuitarTodos = document.createElement("button");
        btnQuitarTodos.textContent = "X";
        btnQuitarTodos.className = "carrito-btn carrito-btn-remove"; // Asignar clase
        btnQuitarTodos.addEventListener("click", (function(prod) {
            return function() {
                eliminarItemDelCarrito(prod); // Asegúrate de que esta función elimine todos los ítems del producto específico
            };
        })(producto));
        li.appendChild(btnQuitarTodos);

        carrito.appendChild(li);
        var numeroItems = Object.keys(carritoProductos).reduce(function(total, producto) {
            return total + carritoProductos[producto];
        }, 0);
    
        document.getElementById("numeroItemsCarrito").textContent = numeroItems;
    }
}
function eliminarItemDelCarrito(producto) {
    // Verifica si el producto existe en el carrito
    if (carritoProductos.hasOwnProperty(producto)) {
        // Elimina el producto del carrito
        delete carritoProductos[producto];

        // Actualiza el carrito y el coste total para reflejar los cambios
        actualizarCarrito();
        actualizarCosteTotal();
    } else {
        console.log('El producto no está en el carrito.');
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

            
            actualizarCarrito();
            actualizarCosteTotal();
        } else {
            console.log('El producto no está en el carrito.');
        }
    }
}
function eliminarDelCarrito(producto) {
    var productoEnMinusculas = producto.toLowerCase();
    var productoEnLista = Object.keys(carritoProductos).find(key => key.toLowerCase() === productoEnMinusculas);
    
    if (productoEnLista) {
        carritoProductos[productoEnLista]--;
        if (carritoProductos[productoEnLista] === 0) {
            delete carritoProductos[productoEnLista];
        }

        // Actualizar el coste total y el carrito

        actualizarCarrito();
        actualizarCosteTotal();
    } else {
        console.log('El producto no está en el carrito.');
    }
}

function eliminarTodoDelCarrito() {
    var carrito = document.getElementById("carrito");
    while (carrito.firstChild) {
        carrito.removeChild(carrito.firstChild);
    }

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
            microfonoBtn.classList.add('active');
            microfonoBtn.innerHTML = '<img src="/img/microphone.png" alt="Botón micrófono activo">'; /* Cambia a otra imagen */
        };
        
        recognition.onend = function() {
            microfonoBtn.classList.remove('active');
            microfonoBtn.innerHTML = '<img src="/img/microphone-slash.png" alt="Botón micrófono">'; /* Cambia a la imagen original */
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
document.getElementById("mostrarCarritoBtn").addEventListener("click", function() {
    var carrito = document.getElementById("popupCarrito");
    
    carrito.style.display = "block"; // Muestra el carrito
    // Utiliza setTimeout para asegurar que el carrito esté visible antes de ajustar la posición
    setTimeout(function() {
        carrito.style.bottom = "0"; // Ajusta la posición para que el carrito aparezca desde la parte inferior
    }, 10); // Ajusta el tiempo de espera según sea necesario
    
});
document.getElementById("cerrarCarritoBtn").addEventListener("click", function() {
    var popupCarrito = document.getElementById("popupCarrito");
    popupCarrito.style.bottom = "-100%";
    setTimeout(function() {
        popupCarrito.style.display = "none";
    }, 500);
});
// Añadir un event listener al botón de microfono
document.getElementById("microfonoBtn").addEventListener("click", iniciarReconocimientoVoz);