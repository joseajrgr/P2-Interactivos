// Agrega esto al inicio del archivo
const socket = io();

// Agrega esta función para generar el código QR
function generarQR() {
  let qrCode = new QRCode(document.getElementById('qrCode'), {
      text: 'escanearCarrito', // Cambia el texto a un identificador único
      width: 256,
      height: 256,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
  });
}

// Llama a la función generarQR cuando la página se haya cargado
window.onload = generarQR;

// Agrega esta función para mostrar los datos del carrito recibido
function mostrarCarritoRecibido(carritoData) {
  let productos = document.getElementById('productos');
  productos.innerHTML = '';
  for (let producto in carritoData) {
      let item = document.createElement('p');
      item.textContent = `${producto}: ${carritoData[producto]}`;
      productos.appendChild(item);
  }
}

// Escucha el evento 'carrito' emitido por el servidor
socket.on('carrito', function(carritoData) {
  console.log('Datos del carrito recibidos en el cliente:', carritoData);
  mostrarCarritoRecibido(carritoData);
});

document.getElementById('deleteProduct').addEventListener('click', function() {
  // Oculta los otros botones
  document.getElementById('showAddProductForm').style.display = 'none';
  document.getElementById('showUpdateProductForm').style.display = 'none';

  // Muestra el botón de cancelar
  document.getElementById('cancelDeleteProduct').style.display = 'block';

  fetch('https://' + window.location.hostname + '/getProducts')
    .then(response => response.json())
    .then(products => {
      const select = document.getElementById('productSelect');
      // Primero, limpia las opciones existentes
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
      // Luego, añade las nuevas opciones
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = product;
        option.text = product;
        select.appendChild(option);
      });
      // Finalmente, muestra el desplegable y el botón de confirmación
      document.getElementById('deleteProductContainer').style.display = 'block';
    });
});

document.getElementById('cancelDeleteProduct').addEventListener('click', function() {
  // Oculta el botón de cancelar y el contenedor de borrar producto
  document.getElementById('cancelDeleteProduct').style.display = 'none';
  document.getElementById('deleteProductContainer').style.display = 'none';

  // Muestra los otros botones
  document.getElementById('showAddProductForm').style.display = 'block';
  document.getElementById('showUpdateProductForm').style.display = 'block';
});

  document.getElementById('confirmDeleteProduct').addEventListener('click', function() {
    const select = document.getElementById('productSelect');
    const productToDelete = select.value;
  
    fetch('https://' + window.location.hostname + '/deleteProduct', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product: productToDelete }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Producto eliminado con éxito') {
            alert('Producto borrado con éxito');
            // Oculta el desplegable y el botón de confirmación
            document.getElementById('deleteProductContainer').style.display = 'none';
            // Oculta el botón de cancelar y el formulario de borrar producto
            document.getElementById('cancelDeleteProduct').style.display = 'none';
            //document.getElementById('deleteProductForm').style.display = 'none';

            // Muestra los otros botones
            document.getElementById('showAddProductForm').style.display = 'block';
            document.getElementById('showUpdateProductForm').style.display = 'block';
      } else {
        alert('Error al borrar el producto');
      }
    });
  });

  document.getElementById('showAddProductForm').addEventListener('click', function() {
    // Oculta los otros botones
    document.getElementById('deleteProduct').style.display = 'none';
    document.getElementById('showUpdateProductForm').style.display = 'none';

    // Muestra el botón de cancelar
    document.getElementById('cancelAddProduct').style.display = 'block';

    // Muestra el formulario de añadir producto
    document.getElementById('addProductForm').style.display = 'block';
});

document.getElementById('cancelAddProduct').addEventListener('click', function(event) {
  event.preventDefault();  // Evita que el formulario se envíe de la forma predeterminada

  // Oculta el botón de cancelar y el formulario de añadir producto
  document.getElementById('cancelAddProduct').style.display = 'none';
  document.getElementById('addProductForm').style.display = 'none';

  // Muestra los otros botones
  document.getElementById('deleteProduct').style.display = 'block';
  document.getElementById('showUpdateProductForm').style.display = 'block';
});


document.getElementById('checkData').addEventListener('click', function() {
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCategory = document.getElementById('productCategory').value;

    if (!productName || !productPrice || !productCategory) {
        alert('Por favor, rellena todos los campos');
        return;
    }

    document.getElementById('productImage').style.display = 'block';
    this.style.display = 'none';
    document.querySelector('input[type="submit"]').style.display = 'block';
});
  
document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita que el formulario se envíe de la forma predeterminada
  
    const productImage = document.getElementById('productImage').files[0];
  
    if (!productImage) {
      alert('Por favor, selecciona una imagen para el producto');
      return;
    }
  
    const product = new FormData();
    product.append('nombre', document.getElementById('productName').value);
    product.append('precio', Number(document.getElementById('productPrice').value));
    product.append('categoria', document.getElementById('productCategory').value);
    product.append('imagen', productImage);
  
    fetch('https://' + window.location.hostname + '/addProduct', {
      method: 'POST',
      body: product,
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Producto añadido con éxito') {
        alert('Producto añadido con éxito');
        // Oculta el botón de cancelar y el formulario de añadir producto
        document.getElementById('cancelAddProduct').style.display = 'none';
        document.getElementById('addProductForm').style.display = 'none';

        // Muestra los otros botones
        document.getElementById('deleteProduct').style.display = 'block';
        document.getElementById('showUpdateProductForm').style.display = 'block';
      } else {
        alert('Error al añadir el producto');
      }
    });
  });

  document.getElementById('showUpdateProductForm').addEventListener('click', function() {
    // Oculta los otros botones
    document.getElementById('deleteProduct').style.display = 'none';
    document.getElementById('showAddProductForm').style.display = 'none';

    // Muestra el botón de cancelar
    document.getElementById('cancelUpdateProduct').style.display = 'block';
    fetch('https://' + window.location.hostname + '/getProducts')
        .then(response => response.json())
        .then(products => {
            const select = document.getElementById('productSelectUpdate');
            // Limpia las opciones existentes
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }
            // Añade las nuevas opciones
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product;
                option.text = product;
                select.appendChild(option);
            });
            // Muestra el formulario de modificación
            document.getElementById('updateProductForm').style.display = 'block';
        });
});
document.getElementById('cancelUpdateProduct').addEventListener('click', function(event) {
  event.preventDefault();  // Evita que el formulario se envíe de la forma predeterminada

  // Oculta el botón de cancelar y el formulario de actualizar producto
  document.getElementById('cancelUpdateProduct').style.display = 'none';
  document.getElementById('updateProductForm').style.display = 'none';

  // Muestra los otros botones
  document.getElementById('deleteProduct').style.display = 'block';
  document.getElementById('showAddProductForm').style.display = 'block';
});
document.getElementById('updateProductForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const productToUpdate = document.getElementById('productSelectUpdate').value;
  const updatedName = document.getElementById('productNameUpdate').value;
  const updatedPrice = Number(document.getElementById('productPriceUpdate').value);
  const updatedCategory = document.getElementById('productCategoryUpdate').value;
  const updatedImage = document.getElementById('productImageUpdate').files[0];

  const updatedProduct = {
    nombre: updatedName,
    precio: updatedPrice,
    categoria: updatedCategory
  };

  const formData = new FormData();
  formData.append('productToUpdate', productToUpdate);
  formData.append('updatedProduct', JSON.stringify(updatedProduct));

  if (updatedImage) {
    formData.append('imagen', updatedImage);
  }

  fetch('https://' + window.location.hostname + '/updateProduct', {
    method: 'PUT',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Producto modificado con éxito') {
      alert('Producto modificado con éxito');
      // Oculta el botón de cancelar y el formulario de actualizar producto
      document.getElementById('cancelUpdateProduct').style.display = 'none';
      document.getElementById('updateProductForm').style.display = 'none';

      // Muestra los otros botones
      document.getElementById('deleteProduct').style.display = 'block';
      document.getElementById('showAddProductForm').style.display = 'block';
    } else {
      alert('Error al modificar el producto');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error al modificar el producto');
  });
});