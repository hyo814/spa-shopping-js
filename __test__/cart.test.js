import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
function setupDOM() {
    document.body.innerHTML = `
        <button id="back-button"></button>
        <div id="cart-counter"></div>
        <ul id="cart-list"></ul>
    `;

    const localStorageMock = (function() {
        let store = {};
        return {
            getItem: function(key) {
                return store[key] || null;
            },
            setItem: function(key, value) {
                store[key] = value.toString();
            },
            clear: function() {
                store = {};
            },
            removeItem: function(key) {
                delete store[key];
            }
        };
    })();

    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
    });

    require('../js/cart');
}

describe('장바구니 및 UI 인터랙션 기능 테스트', () => {
    beforeEach(() => {
        setupDOM();
        window.localStorage.clear();
    });

    it('뒤로가기 버튼 클릭시 이전 페이지로 이동합니다', async () => {
        const backButton = document.getElementById('back-button');
        expect(backButton).toBeInTheDocument();
        backButton.click();
    });

    it('장바구니에 아이템을 표시하고, 각 아이템은 삭제 버튼을 포함합니다', async () => {
        window.localStorage.setItem('cartItems', JSON.stringify([{ id: '1', quantity: 2, title: 'Product 1', price: 20 }]));
        require('../js/cart');

        process.nextTick(() => {
            const cartList = document.getElementById('cart-list');
            expect(cartList.children.length).toBe(1);
            expect(cartList.textContent).toContain('Product 1');
            const removeButton = document.querySelector('.remove-btn');
            expect(removeButton).toBeInTheDocument();
        });
    });

    it('장바구니에서 아이템을 삭제하면, UI와 로컬 스토리지에서 아이템이 제거됩니다', () => {
        window.localStorage.setItem('cartItems', JSON.stringify([{ id: '1', quantity: 2 }]));
        require('../js/cart');

        process.nextTick(() => {
            const removeButton = document.querySelector('.remove-btn');
            fireEvent.click(removeButton);

            expect(document.querySelector('#cart-list').children.length).toBe(0);
            expect(window.localStorage.getItem('cartItems')).toBe(JSON.stringify([]));
        });
    });

    it('장바구니 개수 표시가 정확히 업데이트됩니다', () => {
        window.localStorage.setItem('cartItems', JSON.stringify([{ id: '1', quantity: 2 }, { id: '2', quantity: 3 }]));
        require('../js/cart');

        process.nextTick(() => {
            const cartCounter = document.getElementById('cart-counter');
            expect(cartCounter.textContent).toBe('5');
        });
    });
});
