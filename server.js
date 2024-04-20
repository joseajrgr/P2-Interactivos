const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
// Definimos el puerto en el que escuchará nuestro servidor
const PORT = 80;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Sirve todos los archivos estáticos desde el directorio actual
// Permite solicitudes CORS desde cualquier origen
app.use(cors());

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');

   // Escucha el evento 'carrito' enviado por el cliente
   socket.on('carrito', (carritoData) => {
      console.log('Datos del carrito recibidos en el servidor:', carritoData);
      // Emite los datos del carrito a todos los clientes conectados
      io.emit('carrito', carritoData);
  });

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

app.delete('/deleteProduct', (req, res) => {
  const productToDelete = req.body.product;

  fs.readFile('productos.json', (err, data) => {
    if (err) {
      console.error('Error leyendo el fichero productos.json:', err);
      res.status(500).send({message: 'Error del servidor'});
      return;
    }

    let products = JSON.parse(data);

    if (!products.hasOwnProperty(productToDelete)) {
      res.status(404).send({message: 'Producto no encontrado'});
      return;
    }

    delete products[productToDelete];

    fs.writeFile('productos.json', JSON.stringify(products), (err) => {
      if (err) {
        console.error('Error escribiendo el fichero productos.json:', err);
        res.status(500).send({message: 'Error del servidor'});
        return;
      }

      res.send({message: 'Producto eliminado con éxito'});
    });
  });
});

app.get('/getProducts', (req, res) => {
  fs.readFile('productos.json', (err, data) => {
    if (err) {
      console.error('Error leyendo el fichero productos.json:', err);
      res.status(500).send({message: 'Error del servidor'});
      return;
    }

    let products = JSON.parse(data);
    res.send(Object.keys(products));
  });
});

// Configura multer para guardar los archivos cargados en la carpeta 'img'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)  // Usa el nombre original del archivo
  }
})

const upload = multer({ storage: storage });

app.post('/addProduct', upload.single('imagen'), (req, res) => {
  const productToAdd = req.body;
  productToAdd.imagen = path.join('img', req.file.filename);  // Añade la ruta de la imagen al producto

  fs.readFile('productos.json', (err, data) => {
    if (err) {
      console.error('Error leyendo el fichero productos.json:', err);
      res.status(500).send({message: 'Error del servidor'});
      return;
    }

    let products = JSON.parse(data);

    if (products.hasOwnProperty(productToAdd.nombre)) {
      res.status(400).send({message: 'El producto ya existe'});
      return;
    }

    products[productToAdd.nombre] = {
      precio: productToAdd.precio,
      imagen: productToAdd.imagen,
      categoria: productToAdd.categoria
    };

    fs.writeFile('productos.json', JSON.stringify(products), (err) => {
      if (err) {
        console.error('Error escribiendo el fichero productos.json:', err);
        res.status(500).send({message: 'Error del servidor'});
        return;
      }

      res.send({message: 'Producto añadido con éxito'});
    });
  });
});

app.put('/updateProduct', upload.single('imagen'), (req, res) => {
  const productToUpdate = req.body.productToUpdate;
  const updatedProduct = JSON.parse(req.body.updatedProduct);

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo JSON:', err);
      res.status(500).json({ error: 'Error al leer el archivo JSON' });
      return;
    }

    const productos = JSON.parse(data);

    if (productos.hasOwnProperty(productToUpdate)) {
      const updatedProductName = updatedProduct.nombre || productToUpdate;

      productos[updatedProductName] = {
        precio: updatedProduct.precio || productos[productToUpdate].precio,
        categoria: updatedProduct.categoria || productos[productToUpdate].categoria,
        imagen: productos[productToUpdate].imagen, // Mantener la imagen existente por defecto
      };

      if (req.file) {
        productos[updatedProductName].imagen = req.file.path;
      }

      // Eliminar el producto anterior si se cambió el nombre
      if (updatedProductName !== productToUpdate) {
        delete productos[productToUpdate];
      }

      fs.writeFile('productos.json', JSON.stringify(productos), 'utf8', (err) => {
        if (err) {
          console.error('Error al escribir en el archivo JSON:', err);
          res.status(500).json({ error: 'Error al escribir en el archivo JSON' });
          return;
        }

        res.json({ message: 'Producto modificado con éxito' });
      });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  });
});


server.listen(PORT, '0.0.0.0', () => console.log(`Servidor escuchando en el puerto ${PORT}`));
