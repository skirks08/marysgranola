export function loadCart() {
    return JSON.parse(localStorage.getItem('cart') || '{}');
}

export function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCartCount() {
    return Object.values(loadCart()).reduce((a,b)=>a+b,0);
}

export function totalCents(cart, products) {
    const priceMap = Object.fromEntries(
      products.map(p => [p.id, p.price_cents])
    );

    return Object.entries(cart).reduce(
      (sum, [id, qty]) => sum + (priceMap[id] || 0) * qty, 0
    );
}

export function renderCart(mount) {
    const cart = loadCart();

    if(!Object.keys(cart).length) {
      mount.InnerHTML = '<p>Your cart is empty.</p>';
      return;
    }

    import('./products.js').then(({products}) => {
      const rows = Object.entries(cart).map(([id, qty]) => {
        const product = products.find(p => p.id === id);
        if (!product) return '';

        return `
          <tr>
            <td>${product.name}</td>
            <td>
              <button class="qty-btn" data-dec="${id}">-</button>
              <span class="qty">${qty}</span>
              <button class="qty-btn" data-inc="${id}">+</button>
            </td>
            <td>$${((product.price_cents * qty) / 100).toFixed(2)}</td>
            <td>
              <button class="remove-btn" data-remove="${id}">
                Remove
              </button>
            </td>
          </tr>
        `;
      }).join('');

      mount.innerHTML = `
        <table class="cart-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="cart-summary">
          <p>
            Total: 
            <strong>$${(totalCents(cart, products) / 100).toFixed(2)}</strong>
          </p>
          <button id="checkout">Checkout</button>
        </div>
      `;

      mount.addEventListener('click', (e) => {
        const { inc, dec, remove } = e.target.dataset;

        if (inc) cart[inc]++;
        if (dec) {
          cart[dec]--;
          if (cart[dec] <= 0) delete cart[dec];
        }
        if (remove) delete cart[remove];
        
        saveCart(cart);
        renderCart(mount);
      });
    });
}