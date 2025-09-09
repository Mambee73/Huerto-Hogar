document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');
    const requiredDomain = '@huertohogar.cl';

    if (!email.endsWith(requiredDomain)) {
        loginMessage.textContent = 'El correo debe ser del dominio @huertohogar.cl';
        loginMessage.style.color = 'red';
        return;
    }

    if (email === 'admin@huertohogar.cl' && password === '123456') {
        loginMessage.textContent = '¡Inicio de sesión exitoso!';
        loginMessage.style.color = 'green';
    } else {
        loginMessage.textContent = 'Correo o contraseña incorrectos.';
        loginMessage.style.color = 'red';
    }
});

document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerMessage = document.getElementById('registerMessage');
    const allowedDomains = ['huertohogar.cl', 'gmail.com', 'duocuc.cl'];

    registerMessage.textContent = '';
    registerMessage.style.color = 'red';

    if (name === '' || email === '' || password === '' || confirmPassword === '') {
        registerMessage.textContent = 'Todos los campos son obligatorios.';
        return;
    }

    if (password !== confirmPassword) {
        registerMessage.textContent = 'Las contraseñas no coinciden.';
        return;
    }
    
    const emailDomain = email.substring(email.lastIndexOf('@') + 1);
    
    if (!allowedDomains.includes(emailDomain)) {
        registerMessage.textContent = 'El correo no es de un dominio válido.';
        return;
    }

    registerMessage.textContent = '¡Registro exitoso!';
    registerMessage.style.color = 'green';
    this.reset();
});


let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

function saveCartToLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}


function addToCart(productName, price) {
    let productFound = false;
    for (let i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].name === productName) {
            shoppingCart[i].quantity++;
            productFound = true;
            break;
        }
    }
    if (!productFound) {
        shoppingCart.push({ name: productName, price: price, quantity: 1 });
    }
    saveCartToLocalStorage();
    alert(`¡${productName} añadido al carrito!`);
}

function removeFromCart(productName) {
    shoppingCart = shoppingCart.filter(item => item.name !== productName);
    saveCartToLocalStorage();
    renderCart(); 
}

function changeQuantity(productName, change) {
    const item = shoppingCart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            saveCartToLocalStorage();
            renderCart(); 
        }
    }
}

function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';
    let total = 0;

    if (shoppingCart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center;">Tu carrito está vacío.</p>';
        document.getElementById('cart-total').textContent = 'Total: $0 CLP';
        return;
    }
    
    const headerRow = document.createElement('div');
    headerRow.classList.add('cart-item-row');
    headerRow.innerHTML = `
        <h4 style="margin: 0;">Producto</h4>
        <h4 style="margin: 0;">Precio</h4>
        <h4 style="margin: 0;">Cantidad</h4>
        <h4 style="margin: 0;">Total por producto</h4>
        <h4 style="margin: 0;">Acciones</h4>
    `;
    cartContainer.appendChild(headerRow);

    shoppingCart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('cart-item-row');
        
        const subtotal = item.price * item.quantity;
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
            </div>
            <span>$${item.price} CLP</span>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
                <input type="number" value="${item.quantity}" min="1" disabled>
                <button class="quantity-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
            </div>
            <span>$${subtotal} CLP</span>
            <button class="remove-btn" onclick="removeFromCart('${item.name}')">Eliminar</button>
        `;
        cartContainer.appendChild(itemRow);
        total += subtotal;
    });

    document.getElementById('cart-total').textContent = `Total: $${total} CLP`;
}


document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.product-card .add-to-cart');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const name = productCard.getAttribute('data-name');
            const price = parseFloat(productCard.getAttribute('data-price'));
            if (name && price) {
                addToCart(name, price);
            }
        });
    });

    renderCart();
});