const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');

// Definimos el puerto en el que escuchará nuestro servidor
const PORT = 80;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname)); // Sirve todos los archivos estáticos desde el directorio actual

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');

  socket.on('update_products', (data) => {
    fs.writeFile('productos.json', JSON.stringify(data), err => {
      if(err){
        console.error('Error escribiendo el fichero productos.json:', err);
        socket.emit('error', {message: 'Error del servidor'});
      } else {
        socket.emit('success', {message: 'Productos actualizados'});
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });
});

server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
