export function loadCart() {
    return JSON.parse(localStorage.getItem('cart') || '{}');
}

export function saveCart(c) {
    localStorage.setItem('cart', JSON.stringify(c));
}

export function getCartCount() {
    return Object.values(loadCart()).reduce((a,b)=>a+b,0);
}

export function totalCents(cart = loadCart(), prodArr) {
    const map = Object.fromEntries(prodArr.map(p => [p.id, p.price_cents]));
    return Object.entries(cart).reduce((sum,[id,q]) => sum + map[id]*q, 0);
}

export function renderCart(mount) {
    const cart = loadCart();
    if (!Object.keys(cart).length) {
        mount.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }
    import('./products.js').then(({ products }) => {
    const rows = Object.entries(cart).map(([id,q]) => {
      const p = products.find(x=>x.id===id);
      return `<tr>
        <td>${p.name}</td><td>${q}</td>
        <td>$${((p.price_cents*q)/100).toFixed(2)}</td>
      </tr>`;
    }).join('');
    mount.innerHTML = `
      <table>${rows}</table>
      <p>Total: <strong>$${(totalCents(cart,products)/100).toFixed(2)}</strong></p>
      <button id="checkout">Checkout</button>`;
  });
}