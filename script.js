var listaProductos = {
    "Zapatillas deportivas Kike": 80,
    "Camiseta de algodón": 20,
    "Lavadora": 120,
    "Lámpara": 35
};

var costeTotal = 0;

function agregarAlCarrito(producto) {
    if (producto === undefined) {
        var productoInput = document.getElementById("productoInput");
        var producto = productoInput.value.trim();
        productoInput.value = "";
    }
    console.log('Intentando agregar al carrito: ' + producto);
   
    var productoEnMinusculas = producto.toLowerCase();
    var productoEnLista = Object.keys(listaProductos).find(key => key.toLowerCase() === productoEnMinusculas);

    if (producto !== "" && productoEnLista) {
        var carrito = document.getElementById("carrito");
        var li = document.createElement("li");
        li.textContent = productoEnLista;
        carrito.appendChild(li);
        

        costeTotal += listaProductos[productoEnLista];
        console.log('Coste total del carrito: $' + costeTotal);
    } else {
        console.log('Lo sentimos, no encontramos el producto que busca.');
    }
}

function eliminarDelCarrito(producto) {
    var productoEnMinusculas = producto.toLowerCase();
    var productoEnLista = Object.keys(listaProductos).find(key => key.toLowerCase() === productoEnMinusculas);

    if (producto !== "" && productoEnLista) {
        var carrito = document.getElementById("carrito");
        var items = Array.from(carrito.getElementsByTagName("li"));
        var itemAEliminar = items.find(item => item.textContent.toLowerCase() === productoEnMinusculas);

        if (itemAEliminar) {
            carrito.removeChild(itemAEliminar);
            costeTotal -= listaProductos[productoEnLista];
            console.log('Coste total del carrito: $' + costeTotal);
        } else {
            console.log('El producto no está en el carrito.');
        }
    } else {
        console.log('Lo sentimos, no encontramos el producto que busca.');
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
                agregarAlCarrito(speechResult.slice(6));
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