document.addEventListener('DOMContentLoaded', function () {
    const productId = new URLSearchParams(window.location.search).get('id');
    const productDetails = document.getElementById('product-details');
    const backButton = document.getElementById('back-button');
    const cartCounter = document.getElementById('cart-counter');

    backButton.addEventListener('click', function () {
        window.history.back();
    });

    const cartCounterDiv = document.getElementById('cart-counter');
    cartCounterDiv.style.cursor = 'pointer';
    cartCounterDiv.onclick = function() {
        location.href = '../cart.html';
    };

    function updateCartCounter() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartCounter.textContent = `장바구니: ${cartItems.length}개`;
    }

    function displayProductDetails(product) {
        productDetails.innerHTML = `
          <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
            <div class="product-info">
             <ul>
              <li>title</li>
               <p>${product.title}</p>
              <li>brand</li>
               <p>${product.brand}</p>
              <li>category</li>
               <p>${product.category}</p>
              <li>price</li>
               <p>$ ${product.price}</p>
              <li>stock</li>
               <p>${product.stock}</p>
              <li>description</li>
               <p>${product.description}</p>
              <li>discountPercentage</li>
               <p>${product.discountPercentage}</p>
            </ul>
             <input type="number" id="quantity" min="1" value="1">
             <button class="add-to-cart-button" onclick="addToCart(${product.id})">장바구니 담기</button>
            </div> 
        `;
    }

    function fetchProductDetails(productId) {
        fetch(`https://dummyjson.com/products/${productId}`)
            .then(response => response.json())
            .then(data => displayProductDetails(data))
            .catch(error => console.error('Error fetching product details:', error));
    }

    window.addToCart = function (productId) {
        const quantity = parseInt(document.getElementById('quantity').value);
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const productInCart = cartItems.find(item => item.id === productId);

        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cartItems.push({id: productId, quantity});
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCounter();
    };

    fetchProductDetails(productId);
    updateCartCounter();
});
