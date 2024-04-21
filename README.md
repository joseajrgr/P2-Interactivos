-----------INTEGRANTES-----------
- José Antonio Jareño García: 100472166
- Alejandro del Viejo Gutiérrez:100472387
- Miguel Galicia Achirica: 100472341
- Pablo González González: 100472241

----------MODIFICACIONES-----------
- La interfaz la hemos redistribuido y cambiado ligeramente a la que habíamos diseñado para la P1, pero la base sigue siendo la misma.
- La sección "para ti" se ha sustituido por "todo", donde aparecen todos los productos, independientemente de la categoría.

-----------AÑADIDOS--------------
- Pantalla de registro: En esta pantalla podrás seleccionar si eres cliente o encargado, además de poder registrarte.
- Pantalla de encargado: Si seleccionas encargado, te lleva a una web donde aparecerán 3 opciones: borrar, añadir o modificar un producto. Mediante estas opciones se podrá cambiar todo lo relacionado con el json de productos, incluso la imagen de estos.
- Al darle al botón de pagar en el dispositivo de cliente, se abrirá la cámara con la que este tendrá que escanear el qr de un encargado, para que así al encargado le aparezca los productos que ha añadido el cliente.
- Chatbot: Aunque en el final de la P1 no lo incluimos, pensamos varias veces añadir un botón de ayuda. Esto lo hemos acabado haciendo implementando un chatbot, que hasta puede generar un cupón de descuento para aplicar en el carrito (una vez por sesión).
- En el modo una mano hemos añadido diferentes gestos mediante los sensores de movimiento y giroscopio, si agitas el móvil hacia la derecha añades el producto que aparece en pantalla, hacia la izquierda lo borras, hacia delante pasas al anterior, y hacia detrás al siguiente.
- Notificaciones que indican cuando se añade un producto, el resultado del reconocimiento de voz...

Funcionalidades no implementadas:
- Micrófono siempre abierto: Al final no hemos implementado esta funcionalidad ya que hemos decidido que es más "seguro" y mejor en cuanto a rendimiento. En su lugar, para activar el micrófono simplemente hay que pulsar el botón.

------------- EJECUCIÓN -------------
1. Para ejecutarlo, primero necesitamos ejecutar el siguiente comando para abrir el servidor con node: node server.js
2. A continuación, debemos abrir el puerto 80 mediante VisualStudio. Esto se hace de la siguiente forma: Pulsar sobre el icono de una antena en la parte inferior de la pestaña -> pulsar en "Forward a Port" -> Escribir el 80 y darle a enter -> copiar la dirección que aparece (......devtunnels.ms/) -> Buscar esa URL con el ordenador y también desde el móvil -> Registrarse con github si lo pidiese.
Todo esto es necesario, ya que usamos módulos que necesitan una conexión segura (https), y con el node únicamente no cumplíamos esto.

----------- USO ---------------
1. Abrir la página tanto en el dispositivo móvil como en el ordenador (u otro dispositivo móvil).
2. Seleccionar encargado con el ordenador y cliente en el móvil, darle a registrar (no es necesario introducir nombre o contraseña).
3. Con el encargado, se puede añadir, borrar o modificar cualquier producto.
    3.1. Para añadir, pulsar en "Añadir producto" rellenar todos los parámetros, darle a comprobar, y confirmar. También se puede cancelar con el botón "Cancelar".
    3.2. Para borrar, pulsar en "Borrar producto", seleccionar del desplegable el producto a borrar, y confirmar borrado.
    3.3. Para modificar, el procedimiento es igual al de añadir, seleccionando el producto del desplegable y modificando los campos del producto que se quiera.
4. Con el cliente, podemos probar las siguientes funciones:
    4.1. Reconocimiento de voz: Pulsar el botón de micrófono y probar a decir "Añade 3 camisetas", "Elimina todo", "Añade una lavadora". 
    4.2. Barra de búsqueda: Se puede introducir el nombre de cualquier producto y antes de terminar de escribirlo irán apareciendo las sugerencias.
    4.3. Carrito: Al pulsar en el icono del carrito, se desplegará el mismo, mostrando la lista de productos añadidos, la opción de añadir el cupón, y la opción de pagar. También se puede eliminar y modificar la cantidad de cada producto añadido.
    4.4. Categorías: Al seleccionar cualquiera de las categorías se filtrarán los productos.
    4.5. Chatbot: El chatbot explica las principales funcionalidades cuando las seleccionasd del desplegable. Además, seleccionando la opción de cupón de descuento, se generará y copiará al portapapeles. Solo se puede generar uno por sesión, ya que si se prueba a solicitar otro, avisará de que no es posible.
    4.6. Modo una mano: Pulsar el botón con icono de una mano. La interfaz se modificará reubicando los botones para que sean más accesibles. Además, para añadir, quitar y desplazarse por los productos se puede realizar mediante los gestos que hemos mencionado previamente.
    4.7. Desde el carrito, seleccionar la opción de "pagar". Se abrirá la camara y necesitará escanear el qr de la página de encargado (que tenemos previamente abierta en el ordenador).
   