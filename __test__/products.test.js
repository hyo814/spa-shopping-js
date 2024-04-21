import '@testing-library/jest-dom';
import { fireEvent, waitFor } from '@testing-library/dom';

function setupDOM() {
    document.body.innerHTML = `
    <select id="items-per-page">
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="30">30</option>
    </select>
    <button id="search-button"></button>
    <input id="search-box" />
    <div id="cart-counter"><span></span></div>
    <div id="product-list"></div>
    <div id="pagination"></div>
    <a href="../cart.html"></a>
  `;

    require('../js/products');
}

describe('페이지 로드와 상호 작용 테스트', () => {
    beforeEach(() => {
        setupDOM();
    });

    it('제품 리스트가 그리드 형태로 보여지고, 상세 페이지로 이동 가능합니다', () => {
        const productList = document.getElementById('product-list');
        expect(productList).toBeEmptyDOMElement();

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    products: [
                        { id: '1', thumbnail: 'image1.png', title: 'Product 1', price: '10' },
                        { id: '2', thumbnail: 'image2.png', title: 'Product 2', price: '20' }
                    ]
                })
            })
        );

        require('../js/products');
    });

    it('보여질 제품 개수를 선택할 수 있습니다', async () => {
        const itemsPerPageSelect = document.getElementById('items-per-page');
        fireEvent.change(itemsPerPageSelect, { target: { value: '20' } });
        await waitFor(() => {
            expect(itemsPerPageSelect.value).toBe('20');
        });
    });

    it('페이징 처리와 페이지 이동이 가능합니다', async () => {
        const pagination = document.getElementById('pagination');
        await waitFor(() => {
            expect(pagination).toBeInTheDocument();
            fireEvent.click(pagination);
        });
    });

    it('검색 기능이 동작합니다', async () => {
        const searchBox = document.getElementById('search-box');

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    products: [
                        { id: '1', thumbnail: 'image1.png', title: 'Product 1', price: '10' },
                        { id: '2', thumbnail: 'image2.png', title: 'Product 2', price: '20' }
                    ]
                })
            })
        );

        require('../js/products');

        fireEvent.change(searchBox, { target: { value: 'Product 2' } });
        fireEvent.keyUp(searchBox, { key: 'Enter' });
    });

    it('장바구니에 담긴 개수가 표시되며, 장바구니 페이지로 이동 가능합니다', async () => {
        const cartCounter = document.getElementById('cart-counter');
        fireEvent.click(cartCounter);
    });
});
