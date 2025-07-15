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
      <h3>${p.name}</h3>
      <p>$${(p.price_cents/100).toFixed(2)}</p>
      <button data-add="${p.id}">Add to Cart</button>
    </article>
  `).join('');

  mount.addEventListener('click', (e) => {
    const id = e.target.dataset.add;
    if (!id) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    cart[id] = (cart[id] || 0) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added!');
  });
}; 