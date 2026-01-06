export const products = [
    {
        id: 'honey-almond',
        name: 'Honey Almond',
        price_cents: 899,
        image: 'images/honey-almond.jpg',
        description: 'Local honey, toasted almonds, sunflower seeds.'
    },
    // Add more products here 
];

export function renderProducts(list, mount) {
    mount.innerHTML = list.map(p => `
    <article class="card">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="price">$${(p.price_cents/100).toFixed(2)}</p>
        <p class="desc">${p.description}</p>
        <button data-add="${p.id}" aria-label="Add ${p.name} to cart">Add to Cart</button>
      </div>
    </article>
  `).join('');

  const cartCountEl = document.getElementById('cart-count');

  mount.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-add]');
    if (!btn) return;

    const id = btn.dataset.add;
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');

    cart[id] = (cart[id] || 0) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update floating cart count
    if (cartCountEl) {
      cartCountEl.textContent = Object.values(cart).reduce((a, b) => a + b, 0);
    }

    // UX feedback (no alert)
    btn.textContent = 'Added ✓';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.disabled = false;
    }, 1200);
  });
}; 