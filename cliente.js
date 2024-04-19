var listaProductos = {};
var categoriaSeleccionada = 'Todo'; // Categoría inicial

fetch('productos.json')
    .then(response => response.json())
    .then(data => listaProductos = data)
    .catch(error => console.error('Error:', error));

function cargarProductos() {
    var lista = document.getElementById('listaProductos');
    lista.innerHTML = ''; // Limpiar la lista

    var productoIndex = 0;
    for (var producto in listaProductos) {
        // Si la categoría del producto coincide con la seleccionada, o si la seleccionada es 'Todo'
        if (listaProductos[producto].categoria == categoriaSeleccionada || categoriaSeleccionada == 'Todo') {
            var li = document.createElement('li');
            li.className = 'producto'; // Agregar la clase 'producto'
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
    
            // Si estamos en modo de una sola mano, solo mostramos el primer producto
            if (modoUnaMano) {
                li.style.display = productoIndex === 0 ? 'block' : 'none';
            }

            lista.appendChild(li);
            productoIndex++;
        }
    }
}

var categorias = document.getElementsByClassName('categoria');
for (var i = 0; i < categorias.length; i++) {
    categorias[i].addEventListener('click', function() {
        categoriaSeleccionada = this.textContent;
        productoActual = 0;
        cargarProductos();
    });
}

function generarEstrellasAleatorias() {
    var estrellas = '';
    var numEstrellas = Math.floor(Math.random() * 5) + 1; // Genera un número aleatorio de 1 a 4

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
                agregarAlCarrito(prod, 1); 
            };
        })(producto));
        li.appendChild(btnAñadirUno);

        // Botón para quitar todos
        var btnQuitarTodos = document.createElement("button");
        btnQuitarTodos.textContent = "X";
        btnQuitarTodos.className = "carrito-btn carrito-btn-remove"; // Asignar clase
        btnQuitarTodos.addEventListener("click", (function(prod) {
            return function() {
                eliminarItemDelCarrito(prod); 
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
            microfonoBtn.classList.add('active');
            microfonoBtn.innerHTML = '<img src="/img/microphone.png" alt="Botón micrófono activo">'; /* Cambia a otra imagen */
        };
        
        
        recognition.onend = function() {
            microfonoBtn.classList.remove('active');
            microfonoBtn.innerHTML = '<img src="/img/microphone-slash.png" alt="Botón micrófono">'; /* Cambia a la imagen original */
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

var modoUnaMano = false;
var productoActual = 0;
var ultimaOrientacion = null;
var cooldownDuracion = 2000; // 2 segundos
ultimaInclinacion = null;
ultimoCambio =null;

function mostrarProductoActual() {
    var lista = document.getElementById('listaProductos');
    var productos = lista.getElementsByTagName('li');

    for (var i = 0; i < productos.length; i++) {
        if (i === productoActual) {
            productos[i].style.display = 'block';
        } else {
            productos[i].style.display = 'none';
        }
    }
}

function handleOrientation(event) {
    if (modoUnaMano) {
        var orientacion = event.gamma;
        var inclinacion = event.beta;
        var tiempoActual = new Date().getTime();

        console.log('Orientación:', orientacion);
        console.log('Inclinación:', inclinacion);

        if (ultimaOrientacion !== null && ultimaInclinacion !== null && tiempoActual - ultimoCambio >= cooldownDuracion) {
            console.log('Última orientación:', ultimaOrientacion);
            console.log('Última inclinación:', ultimaInclinacion);
            console.log('Diferencia de orientación:', orientacion - ultimaOrientacion);
            console.log('Diferencia de inclinación:', inclinacion - ultimaInclinacion);

            if (inclinacion > ultimaInclinacion + 10) {
                console.log('Inclinación hacia adelante');
                // Cambiar al siguiente producto
                productoActual = (productoActual + 1) % Object.keys(listaProductos).length;
                mostrarProductoActual();
                ultimoCambio = tiempoActual;
            } else if (inclinacion < ultimaInclinacion - 10) {
                console.log('Inclinación hacia atrás');
                // Cambiar al producto anterior
                productoActual = (productoActual - 1 + Object.keys(listaProductos).length) % Object.keys(listaProductos).length;
                mostrarProductoActual();
                ultimoCambio = tiempoActual;
            } else if (orientacion > ultimaOrientacion + 10) {
                console.log('Movimiento hacia la derecha');
                // Añadir el producto actual al carrito
                agregarAlCarrito(Object.keys(listaProductos)[productoActual]);
                ultimoCambio = tiempoActual;
            } else if (orientacion < ultimaOrientacion - 10) {
                console.log('Movimiento hacia la izquierda');
                // Quitar el producto actual del carrito
                eliminarDelCarrito(Object.keys(listaProductos)[productoActual]);
                ultimoCambio = tiempoActual;
            }
        }

        ultimaOrientacion = orientacion;
        ultimaInclinacion = inclinacion;
    }
}

window.addEventListener('deviceorientation', function(event) {
    console.log('Evento deviceorientation disparado');
    handleOrientation(event);
});


var touchstartX = 0;
var touchendX = 0;
var productoActual = 0; // Índice del producto actual
var modoUnaMano = false; // Añade esta línea para declarar la variable

function handleGesture() {
    var lista = document.getElementById('listaProductos');
    if (touchendX < touchstartX) {
        // Deslizar a la izquierda: mostrar el siguiente producto
        lista.children[productoActual].style.display = 'none';
        productoActual = (productoActual + 1) % lista.children.length;
        lista.children[productoActual].style.display = 'block';
    }
    if (touchendX > touchstartX) {
        // Deslizar a la derecha: mostrar el producto anterior
        lista.children[productoActual].style.display = 'none';
        productoActual = (productoActual - 1 + lista.children.length) % lista.children.length;
        lista.children[productoActual].style.display = 'block';
    }
}

document.getElementById('listaProductos').addEventListener('touchstart', function(event) {
    if (modoUnaMano) {
        touchstartX = event.changedTouches[0].screenX;
    }
}, false);

document.getElementById('listaProductos').addEventListener('touchend', function(event) {
    if (modoUnaMano) {
        touchendX = event.changedTouches[0].screenX;
        handleGesture();
    }
}, false);

// Añade un controlador de eventos al botón de modo una mano
document.getElementById('modoUnaManoBtn').addEventListener('click', function() {
    modoUnaMano = !modoUnaMano;
    var lista = document.getElementById('listaProductos');
    var categorias = document.querySelector('.categorias');
    var input = document.getElementById('productoInput');
    var agregarBtn = document.getElementById('agregarBtn');
    var micBtn = document.getElementById('microfonoBtn');
    var body = document.querySelector('body');

    if (modoUnaMano) {
        // Ocultar todos los productos excepto el primero
        for (var i = 0; i < lista.children.length; i++) {
            lista.children[i].style.display = i === 0 ? 'block' : 'none';
            lista.children[i].style.heigh = '80%';
        }
        // Reiniciar la orientación y el producto actual
        ultimaOrientacion = null;
        // Reiniciar la inclinación y el producto actual
        ultimaInclinacion = null;
        productoActual = 0;
        // Mover la barra de búsqueda y los botones al final del body
        body.classList.add('modo-una-mano'); // Agrega la clase al body
        body.appendChild(input);
        body.appendChild(agregarBtn);
        body.appendChild(micBtn);
        // Mover las categorías encima de la barra de búsqueda
        body.insertBefore(categorias, input);
    } else {
        // Mostrar todos los productos
        for (var i = 0; i < lista.children.length; i++) {
            lista.children[i].style.display = 'block';
        }
        // Mover la barra de búsqueda y los botones a su posición original
        body.classList.remove('modo-una-mano'); // Remueve la clase del bod
        body.insertBefore(input, lista);
        body.insertBefore(agregarBtn, lista);
        body.insertBefore(micBtn, lista);
        // Mover las categorías a su posición original
        body.insertBefore(categorias, lista);
    }
});

function filtrarProductos() {
    var input = document.getElementById('productoInput');
    var filtro = input.value.toLowerCase();
    var lista = document.getElementById('listaProductos');
    var productos = lista.getElementsByTagName('li');

    for (var i = 0; i < productos.length; i++) {
        var producto = productos[i];
        var texto = producto.textContent.toLowerCase();

        if (texto.includes(filtro)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    }
}

//chatbot




var isChatbotOpened = false; // Variable para rastrear si el chatbot ya ha sido abierto

function toggleChatbot() {
    var chatbotPopup = document.getElementById('chatbot-popup');
    if (chatbotPopup.style.display === 'none') {
        chatbotPopup.style.display = 'block';
        if (!isChatbotOpened) {
            
            isChatbotOpened = true; // Marcar que el chatbot ya ha sido abierto
        }
    } else {
        chatbotPopup.style.display = 'none';
    }
}



function processUserSelection(selection) {
    var response = '';

    switch (selection) {
        case 'hola':
            response = '¡Hola! ¿Cómo puedo ayudarte hoy?';
            break;
        case 'productos':
            response = 'Puedo ayudarte a encontrar productos. ¿Qué estás buscando?';
            break;
        case 'carrito':
            response = 'Puedo ayudarte con tu carrito. ¿Quieres ver los productos en tu carrito?';
            break;
        case 'modo de micro':
            response = 'El modo de micro de nuestra aplicación te permite interactuar con la aplicación usando tu voz. Para comenzar, simplemente di "añade ..." seguido del nombre del producto que quieres añadir a tu carrito. Por ejemplo, puedes decir "añade manzanas" para añadir manzanas a tu carrito. También puedes decir "elimina todo" para vaciar tu carrito o "elimina ..." seguido del nombre del producto para eliminar un producto específico. Recuerda que el reconocimiento de voz es sensible a la pronunciación, así que asegúrate de hablar claramente.';
            break;
        case 'modo de una mano':
            response = 'El modo de una mano de nuestra aplicación está diseñado para facilitar el uso de la aplicación con una sola mano. Todos los controles importantes están colocados en la parte inferior de la pantalla, donde son fácilmente accesibles para el pulgar.';
            break;
        default:
            response = 'Lo siento, no entendí eso. ¿Puedes intentarlo de nuevo?';
    }

    return response;
}

document.getElementById('clear-chat-btn').addEventListener('click', function() {
    var chatMessages = document.getElementById('chat-messages');
    var welcomeMessage = document.getElementById('welcome-message');
    
    var allMessages = Array.from(chatMessages.children);
    
    var messagesToRemove = allMessages.filter(function(element) {
        return element !== welcomeMessage;
    });
    
    messagesToRemove.forEach(function(element) {
        chatMessages.removeChild(element);
    });
});


document.getElementById('user-selection').addEventListener('change', function(event) {
    var userSelection = event.target.value;

    // Agregar el mensaje del usuario al chat
    var userMessage = document.createElement('p');
    userMessage.textContent = 'Usuario: ' + userSelection;
    document.getElementById('chat-messages').appendChild(userMessage);

    // Procesar la selección del usuario y generar una respuesta
    var response = processUserSelection(userSelection);

    // Agregar la respuesta del chatbot al chat
    var botMessage = document.createElement('p');
    botMessage.textContent = 'Chatbot: ' + response;
    document.getElementById('chat-messages').appendChild(botMessage);

    // Limpiar la selección después de enviar
    document.getElementById('user-selection').value = '';
    
});
