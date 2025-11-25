document.addEventListener('DOMContentLoaded', () => {
  // ---------- КОРЗИНА ----------
  let cart = JSON.parse(localStorage.getItem('amirCart') || '[]');

  const cartToggle   = document.getElementById('cart-toggle');
  const cartPanel    = document.getElementById('cart-panel');
  const cartOverlay  = document.getElementById('cart-overlay');
  const cartItemsEl  = document.getElementById('cart-items');
  const cartTotalEl  = document.getElementById('cart-total');
  const cartCountEl  = document.getElementById('cart-count');
  const cartCloseBtn = document.getElementById('cart-close');
  const checkoutBtn  = document.getElementById('checkout-btn');

  function saveCart() {
    localStorage.setItem('amirCart', JSON.stringify(cart));
  }

  function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function cartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function formatPrice(num) {
    return num.toLocaleString('ru-RU') + '₸';
  }

  function updateCartBadge() {
    if (!cartCountEl) return;
    const count = cartCount();
    cartCountEl.textContent = count;
    cartCountEl.style.display = count > 0 ? 'flex' : 'none';
  }

  function renderCart() {
    if (!cartItemsEl) return;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p>Корзина пуста</p>';
    } else {
      cartItemsEl.innerHTML = '';
      cart.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">Размер: ${item.size} · ${item.qty} шт.</div>
          </div>
          <div class="cart-item-right">
            <span>${formatPrice(item.price * item.qty)}</span>
            <button class="cart-remove" data-index="${index}">×</button>
          </div>
        `;
        cartItemsEl.appendChild(row);
      });

      cartItemsEl.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = Number(e.currentTarget.dataset.index);
          cart.splice(idx, 1);
          saveCart();
          renderCart();
          updateCartBadge();
        });
      });
    }

    if (cartTotalEl) {
      cartTotalEl.textContent = formatPrice(cartTotal());
    }
  }

  function openCart() {
    if (!cartPanel || !cartOverlay) return;
    renderCart();
    cartPanel.classList.add('open');
    cartOverlay.classList.add('open');
  }

  function closeCart() {
    if (!cartPanel || !cartOverlay) return;
    cartPanel.classList.remove('open');
    cartOverlay.classList.remove('open');
  }

  cartToggle?.addEventListener('click', openCart);
  cartOverlay?.addEventListener('click', closeCart);
  cartCloseBtn?.addEventListener('click', closeCart);

  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }
    alert('Спасибо за заказ на сумму ' + formatPrice(cartTotal()) + ' (демо-оплата)');
    cart = [];
    saveCart();
    renderCart();
    updateCartBadge();
    closeCart();
  });

  updateCartBadge();

  // Кнопки "+" у товаров
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product-card');
      if (!card) return;

      const name = card.dataset.name ||
        card.querySelector('.product-name')?.textContent.trim() || 'Товар';
      const price = Number(card.dataset.price || 0);

      const sizeSelect = card.querySelector('.product-size select');
      const size = sizeSelect ? sizeSelect.value : '—';

      const existing = cart.find(
        item => item.name === name && item.size === size
      );
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, size, qty: 1 });
      }

      saveCart();
      updateCartBadge();
    });
  });

  // ---------- ПОИСК ----------
  const searchToggle = document.getElementById('search-toggle');
  const searchBar    = document.getElementById('search-bar');
  const searchInput  = document.getElementById('search-input');
  const searchClear  = document.getElementById('search-clear');

  function filterProducts(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const name = (card.dataset.name ||
        card.querySelector('.product-name')?.textContent || '')
        .toLowerCase();
      card.style.display = !q || name.includes(q) ? '' : 'none';
    });
  }

  searchToggle?.addEventListener('click', () => {
    if (!searchBar) return;
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) {
      searchInput?.focus();
    } else {
      if (searchInput) searchInput.value = '';
      filterProducts('');
    }
  });

  searchInput?.addEventListener('input', () => {
    filterProducts(searchInput.value);
  });

  searchClear?.addEventListener('click', () => {
    if (!searchInput) return;
    searchInput.value = '';
    filterProducts('');
  });

  // ---------- ПРОФИЛЬ ----------
  const profileToggle  = document.getElementById('profile-toggle');
  const profileOverlay = document.getElementById('profile-overlay');
  const profileModal   = document.getElementById('profile-modal');
  const profileClose   = document.getElementById('profile-close');
  const profileForm    = document.getElementById('profile-form');

  function openProfile() {
    profileModal?.classList.add('open');
    profileOverlay?.classList.add('open');
  }

  function closeProfile() {
    profileModal?.classList.remove('open');
    profileOverlay?.classList.remove('open');
  }

  profileToggle?.addEventListener('click', openProfile);
  profileOverlay?.addEventListener('click', closeProfile);
  profileClose?.addEventListener('click', closeProfile);

  if (profileForm) {
    const saved = JSON.parse(localStorage.getItem('amirUser') || 'null');
    if (saved) {
      if (profileForm.elements['name'])  profileForm.elements['name'].value  = saved.name  || '';
      if (profileForm.elements['email']) profileForm.elements['email'].value = saved.email || '';
    }

    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name:  profileForm.elements['name'].value.trim(),
        email: profileForm.elements['email'].value.trim(),
      };
      localStorage.setItem('amirUser', JSON.stringify(data));
      alert('Профиль сохранён (локально в браузере)');
      closeProfile();
    });
  }
});
