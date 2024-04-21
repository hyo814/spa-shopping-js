document.addEventListener('DOMContentLoaded', function() {
    let itemsPerPage = 10;
    let currentPage = 1;
    let searchedProducts = [];

    const itemsPerPageSelect = document.getElementById('items-per-page');
    itemsPerPageSelect.addEventListener('change', function(e) {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        updateProductList(searchedProducts);
    });

    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', function() {
        searchProducts(document.getElementById('search-box').value);
    });

    const cartCounterDiv = document.getElementById('cart-counter');
    cartCounterDiv.style.cursor = 'pointer';
    cartCounterDiv.onclick = function() {
        location.href = '../cart.html';
    };

    function updateProductList(products, page = 1) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, products.length);
        const paginatedItems = products.slice(start, end);

        paginatedItems.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}" style="width:100%">
                <h3>${product.title}</h3>
                <p>$ ${product.price}</p>
            `;
            productDiv.onclick = function() {
                location.href = '/productDetails.html?id=' + product.id;
            };
            productList.appendChild(productDiv);
        });

        createPagination(products.length, page);
    }

    function fetchProducts() {
        fetch('https://dummyjson.com/products')
            .then(response => response.json())
            .then(data => {
                updateProductList(data.products);
                searchedProducts = data.products;
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function createPagination(totalItems, currentPage) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        pagination.style.textAlign = 'right';
        const pageCount = Math.ceil(totalItems / itemsPerPage);

        for (let i = 1; i <= pageCount; i++) {
            const pageLink = document.createElement('a');
            pageLink.innerText = i;
            pageLink.href = '#';
            pageLink.className = 'page-number';
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = i;
                updateProductList(searchedProducts, i);
            });
            pagination.appendChild(pageLink);
        }
    }

    function searchProducts(query) {
        const filteredProducts = searchedProducts.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase())
        );
        updateProductList(filteredProducts, 1);
    }

    function updateCartCounter() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCounter = document.getElementById('cart-counter');
        cartCounter.querySelector('span').textContent = cartItems.length;
    }

    function setupSearchFeature() {
        const searchBox = document.getElementById('search-box');
        searchBox.removeEventListener('keyup', searchListener);
        searchBox.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchProducts(e.target.value);
            }
        });
    }

    const searchListener = function(e) {
        searchProducts(e.target.value);
    };

    fetchProducts();
    updateCartCounter();
    setupSearchFeature();
});
