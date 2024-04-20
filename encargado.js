document.getElementById('deleteProduct').addEventListener('click', function() {
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
      } else {
        alert('Error al borrar el producto');
      }
    });
  });

document.getElementById('showAddProductForm').addEventListener('click', function() {
    document.getElementById('addProductForm').style.display = 'block';
    this.style.display = 'none';
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
      } else {
        alert('Error al añadir el producto');
      }
    });
  });

