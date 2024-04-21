document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('back-button');
    const cartCounter = document.getElementById('cart-counter');
    const cartList = document.getElementById('cart-list');

    backButton.addEventListener('click', function() {
        window.history.back();
    });

    function updateCartCounter() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartCounter.textContent = `장바구니: ${cartItems.length}개`;
    }

    function displayCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartList.innerHTML = '';
        cartItems.forEach((item, index) => {
            fetch(`https://dummyjson.com/products/${item.id}`)
                .then(response => response.json())
                .then(product => {
                    const listItem = document.createElement('li');
                    listItem.className = 'cart-item';
                    listItem.innerHTML = `
                        <img src="${product.thumbnail}" alt="${product.title}" class="cart-thumbnail">
                        <span>${product.title} x ${item.quantity}</span>
                        <span>$ ${product.price}</span>
                        <button class="remove-btn" data-index="${index}">삭제</button>
                    `;
                    cartList.appendChild(listItem);
                })
                .catch(error => console.error('Error loading cart item:', error));
        });
    }

    cartList.addEventListener('click', function(event) {
        if (event.target.className === 'remove-btn') {
            const index = event.target.getAttribute('data-index');
            removeFromCart(index);
        }
    });

    function removeFromCart(index) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems();
        updateCartCounter();
    }

    displayCartItems();
    updateCartCounter();
});
