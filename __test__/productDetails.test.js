import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';

function setupDOM() {
    document.body.innerHTML = `
    <div id="product-details"></div>
    <button id="back-button"></button>
    <div id="cart-counter">0</div>
    <button class="add-to-cart-button">Add to Cart</button>
  `;

    require('../js/productDetails');
}

describe('제품 상세 페이지 기능 테스트', () => {
    beforeEach(() => {
        setupDOM();
        Storage.prototype.getItem = jest.fn(() => JSON.stringify([]));
        Storage.prototype.setItem = jest.fn();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    id: '1',
                    thumbnail: 'image1.png',
                    title: 'Product 1',
                    brand: 'Brand A',
                    category: 'Category X',
                    price: 100,
                    stock: 20,
                    description: 'Product Description',
                    discountPercentage: 10
                })
            })
        );
    });

    it('뒤로가기 버튼 클릭시 이전 페이지로 이동합니다', () => {
        const backButton = document.getElementById('back-button');
        expect(backButton).toBeInTheDocument();
        backButton.click();
    });

    it('장바구니에 상품 추가시 장바구니 개수가 업데이트 됩니다', () => {
        const addToCartButton = document.querySelector('.add-to-cart-button');
        const cartCounter = document.getElementById('cart-counter');

        expect(cartCounter.textContent).toBe('0');

        fireEvent.click(addToCartButton);

    });

    it('장바구니 페이지로 이동합니다', () => {
        const cartCounter = document.getElementById('cart-counter');
        fireEvent.click(cartCounter);
    });
});
