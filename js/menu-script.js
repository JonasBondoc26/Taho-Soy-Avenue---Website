document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.category-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      const category = button.getAttribute('data-category');
      const subCategory = button.getAttribute('data-subcategory'); // 👈 new

      // Show/hide menu items based on category + sub-category
      menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const itemSubCategory = item.getAttribute('data-subcategory');

        if (
          category === 'all' ||
          (itemCategory === category && (!subCategory || itemSubCategory === subCategory))
        ) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const cartToggle = document.getElementById('cart-toggle');
  const closeCart = document.getElementById('close-cart');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const cartCount = document.querySelector('.cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem('tahoCart')) || [];
  
  // Update cart display
  function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Clear cart items container
    cartItemsContainer.innerHTML = '';
    
    // If cart is empty
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      cartTotalPrice.textContent = '₱0';
      return;
    }
    
    // Add items to cart
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
      const cartItemElement = document.createElement('div');
      cartItemElement.classList.add('cart-item');
      
      // Calculate item total price
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      
      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">₱${item.price} x ${item.quantity} = ₱${itemTotal}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease" data-index="${index}">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
            <button class="quantity-btn increase" data-index="${index}">+</button>
          </div>
        </div>
        <button class="remove-item" data-index="${index}">×</button>
      `;
      
      cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update total price
    cartTotalPrice.textContent = `₱${totalPrice}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.decrease').forEach(button => {
      button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase').forEach(button => {
      button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', changeQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', removeItem);
    });
    
    // Save cart to localStorage
    localStorage.setItem('tahoCart', JSON.stringify(cart));
  }
  
  // Toggle cart sidebar
  cartToggle.addEventListener('click', function() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
  });
  
  closeCart.addEventListener('click', function() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
  });
  
  cartOverlay.addEventListener('click', function() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
  });
  
  // Add to cart functionality
  document.querySelectorAll('.menu-item').forEach(item => {
    const addButton = document.createElement('button');
    addButton.classList.add('add-to-cart-btn');
    addButton.textContent = 'Add to Cart';
    
    const itemContent = item.querySelector('.menu-item-content');
    itemContent.appendChild(addButton);
    
    addButton.addEventListener('click', function() {
      const name = item.querySelector('.menu-item-name').textContent;
      const priceText = item.querySelector('.menu-item-price').textContent;
      const image = item.querySelector('.menu-item-image').src;
      
      // Extract price (handle multiple price options)
      let price;
      if (priceText.includes('|')) {
        // Take the first price if there are multiple options
        price = parseInt(priceText.split('|')[0].replace('₱', '').trim());
      } else {
        price = parseInt(priceText.replace('₱', '').trim());
      }
      
      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.name === name && cartItem.price === price
      );
      
      if (existingItemIndex !== -1) {
        // Increase quantity if item exists
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        cart.push({
          name: name,
          price: price,
          image: image,
          quantity: 1
        });
      }
      
      // Update cart display
      updateCartDisplay();
      
      // Visual feedback
      addButton.textContent = 'Added!';
      addButton.classList.add('added-to-cart');
      
      setTimeout(() => {
        addButton.textContent = 'Add to Cart';
        addButton.classList.remove('added-to-cart');
      }, 1000);
    });
  });
  
  // Cart item quantity functions
  function decreaseQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      updateCartDisplay();
    }
  }
  
  function increaseQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    cart[index].quantity += 1;
    updateCartDisplay();
  }
  
  function changeQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    const newQuantity = parseInt(e.target.value);
    
    if (newQuantity > 0) {
      cart[index].quantity = newQuantity;
      updateCartDisplay();
    } else {
      e.target.value = cart[index].quantity;
    }
  }
  
  function removeItem(e) {
    const index = parseInt(e.target.dataset.index);
    cart.splice(index, 1);
    updateCartDisplay();
  }
  
  // Checkout functionality
  checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    alert('Thank you for your order!');
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    // Close cart sidebar
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
  });
  
  // Initialize cart display
  updateCartDisplay();
});