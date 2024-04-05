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
  response.writeHead(200, {"Content-Type": contentType});
  response.end(content);
}

// Función para manejar las solicitudes entrantes
const handleRequest = async (request, response) => {
  const urlPath = url.parse(request.url).pathname;

  // Si la solicitud es un GET
  if(request.method === "GET"){
    let content;
    let contentType;

    // Dependiendo de la ruta solicitada, servimos un archivo diferente
    switch(urlPath){
      case "/":
      case "/index.html":
        content = await serveStaticFile("www/index.html");
        contentType = "text/html";
        break;
      case "/script.js":
        content = await serveStaticFile("www/script.js");
        contentType = "text/javascript";
        break;
      case "/style.css":
        content = await serveStaticFile("www/style.css");
        contentType = "text/css";
        break;
      case "/tasks.json":
        content = await serveStaticFile("tasks.json");
        contentType = "application/json";
        break;
      default: 
        content = "Ruta no válida\r\n";
        contentType = "text/html";
    }

    // Enviamos la respuesta con el contenido y el tipo de contenido adecuados
    sendResponse(response, content, contentType);

  // Si la solicitud es un POST
  } else if(request.method === "POST" && urlPath === "/tasks.json"){
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      // Cuando hemos recibido todos los datos, los escribimos en el archivo tasks.json
      fs.writeFile('tasks.json', body, err => {
        if(err){
          // Si hay un error, lo mostramos y enviamos una respuesta de error
          console.error('Error escribiendo el fichero tasks.json:', err);
          response.writeHead(500, {"Content-Type": "text/html"});
          response.end(`Error del servidor\r\n`);
        } else {
          // Si todo ha ido bien, enviamos una respuesta de éxito
          response.writeHead(200, {"Content-Type": "text/html"});
          response.end(`Tareas actualizadas\r\n`);
        }});
    });

  } else {
     // Si no se hizo ni el GET ni el POST, enviamos un error 405
     response.writeHead(405, {"Content-Type": "text/html"});
     response.write(`Método ${request.method} no permitido!\r\n`);
  }
}

// Creamos el servidor y hacemos que escuche en el puerto definido
const server = http.createServer(handleRequest);
server.listen(PORT);
