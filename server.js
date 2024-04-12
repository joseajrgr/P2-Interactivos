// Módulos necesarios
const http = require('http');
const fs = require('fs');
const url = require('url');

// Definimos el puerto en el que escuchará nuestro servidor
const PORT = 80;

// Función para servir archivos estáticos
const serveStaticFile = async (file) => {
  return new Promise((resolve, reject) => {
    // Leemos el archivo y resolvemos la promesa con su contenido
    fs.readFile(file, function(err, data) {
      if(err) reject(err);
      resolve(data);
    });
  });
} 

// Función para enviar la respuesta al cliente
const sendResponse = (response, content, contentType) => {
  response.writeHead(200, {"Content-Type": `${contentType}; charset=UTF-8`});
  response.end(content);
}

// Función para manejar las solicitudes entrantes
const handleRequest = async (request, response) => {
  const urlPath = url.parse(request.url).pathname;

  // Si la solicitud es un GET
  if(request.method === "GET"){
    let content;
    let contentType;

    if (urlPath.startsWith("/img/")) {
      // Si la ruta comienza con /img/, servimos el archivo de imagen correspondiente
      content = await serveStaticFile(urlPath.substr(1)); // substr(1) para eliminar la barra inicial
      contentType = "image/jpg";
    } else {
      // Dependiendo de la ruta solicitada, servimos un archivo diferente
      switch(urlPath){
        case "/":
        case "/index.html":
          content = await serveStaticFile("index.html");
          contentType = "text/html";
          break;
        case "/script.js":
          content = await serveStaticFile("script.js");
          contentType = "text/javascript";
          break;
        case "/style.css":
          content = await serveStaticFile("style.css");
          contentType = "text/css";
          break;
        case "/productos.json":
          content = await serveStaticFile("productos.json");
          contentType = "application/json";
          break;
        default: 
          content = "Ruta no válida\r\n";
          contentType = "text/html";
      }
    }

    // Enviamos la respuesta con el contenido y el tipo de contenido adecuados
    sendResponse(response, content, contentType);

  // Si la solicitud es un POST
  } else if(request.method === "POST" && urlPath === "/productos.json"){
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      // Cuando hemos recibido todos los datos, los escribimos en el archivo tasks.json
      fs.writeFile('productos.json', body, err => {
        if(err){
          // Si hay un error, lo mostramos y enviamos una respuesta de error
          console.error('Error escribiendo el fichero productos.json:', err);
          response.writeHead(500, {"Content-Type": "text/html; charset=UTF-8"});
          response.end(`Error del servidor\r\n`);
        } else {
          // Si todo ha ido bien, enviamos una respuesta de éxito
          response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
          response.end(`Productos actualizados\r\n`);
        }});
    });

  } else {
     // Si no se hizo ni el GET ni el POST, enviamos un error 405
     response.writeHead(405, {"Content-Type": "text/html; charset=UTF-8"});
     response.write(`Método ${request.method} no permitido!\r\n`);
  }
}

// Creamos el servidor y hacemos que escuche en el puerto definido
const server = http.createServer(handleRequest);
server.listen(PORT);
