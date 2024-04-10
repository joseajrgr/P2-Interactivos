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
    }
    console.log('Intentando agregar al carrito: ' + producto);
    
    if (producto !== "" && listaProductos.hasOwnProperty(producto)) {
        var carrito = document.getElementById("carrito");
        var li = document.createElement("li");
        li.textContent = producto;
        carrito.appendChild(li);
        productoInput.value = "";

        costeTotal += listaProductos[producto];
        console.log('Coste total del carrito: $' + costeTotal);
    } else {
        console.log('Lo sentimos, no encontramos el producto que busca.');
    }
}

// Función para iniciar el reconocimiento de voz
function iniciarReconocimientoVoz() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'es-ES'; // Configura el idioma a español
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
            agregarAlCarrito(speechResult);
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