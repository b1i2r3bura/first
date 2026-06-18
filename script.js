 const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const logoutBtn = document.getElementById('logoutBtn');
const main = document.querySelector('main');     //just initailizing for better accessibility

let cart = JSON.parse(sessionStorage.getItem('cart')) || [];  //let store selected books in the cart using session storage   
// json parse convert string to javascript object , get cart items  

     let isLoggedIn = false;  
     if (document.getElementById('loginForm')) {   //gets login form
     document.getElementById('loginForm').addEventListener('submit', function(e) {  //event will work once Login button is  clicked
        e.preventDefault();  // Prevent form submission
        const username = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (username === 'book@gmail.com' && password === 'pass123') {  //open if only this satisfies
            isLoggedIn = true;   
            window.location.href = 'main.html';  // if successfull go to the main page
            alert('Login Successfully!');
''
        } else {           //if login fails 
       document.getElementById('error').innerHTML =
        `<i class="fas-li fas fa-spinner fa-spin"></i> Invalid username or password `;
            //alert('Invalid username or password')
            
        }
    });
}  

document.addEventListener('DOMContentLoaded', function() {   // let the html fully load first, then run these javascript functions
    updateCartCount(); // update cart count
    setupEventListeners(); // set up event listeners for search, cart, and logout buttons
    setupScrollAnimations(); // set up scroll animations for book cards

 if (window.location.pathname.includes('cart.html')) {       // If on cart page, display cart items
        displayCart();  // it's a function that displays cart items
    }
    
    if (window.location.pathname.includes('order-confirmation.html')) {  //when procced to checkout button pressed, go to these two function
        displayOrderConfirmation();
        setupConfirmationPageListeners();
    }
});

function setupEventListeners() {
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);  // when users clicks the search icon the handlesearch function will start working
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {    //using keyup event to trigger search if user selects enter key handlesearch function will be triggered, KEYBOARD EVENT
                handleSearch(); // it's a  function
            }
        });
    }
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';                  //when cart button clicked will go to cart html , MOUSE EVENT
        });
    }
   if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {  //another mouse event (click) that triggers when logout button is touched
               logoutBtn.onclick = null;
        const confirmLogout = confirm("Are you sure you want to logout?");  //confirming are they really loging out
    if (confirmLogout) {
            isLoggedIn = false;
            window.location.href = 'index.html';   //loging them out to the index page
        }

    });
    
}  
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {     //e.target.classList.contains checks if the element has the class "add-to-cart" ,if so do the function
            e.stopPropagation();              //prevents event from bubbling up to parent elements
            const bookCard = e.target.closest('.book-card');  // find the nearest parent with class 'book-card'
            addToCart(bookCard);            // call addToCart function with the found bookCard                
        }
    });
}

function handleSearch() {
    const query = searchInput.value.toLowerCase().trim(); // get the book from the search, change it to low case letters, trim white space
    if (!query) {
  location.reload();                    // If nothing written in search bar and user click enter, reload page to show all categories
        return;
    }
 const allBooks = document.querySelectorAll('.book-card');
    const results = [];
    allBooks.forEach(book => {
        const title = book.getAttribute('data-title').toLowerCase();  //getting the books by data-title which have already given in the html
        const author = book.getAttribute('data-author').toLowerCase();  
        if (title.includes(query) || author.includes(query)) {                  // find all books that match their title or author
            results.push(book.cloneNode(true));           //makes copy of element, if its true copies elemenet and all children, if false : copy only element itself
        }
    });

    main.innerHTML = '<h2>Search Results</h2><div class="books-container" id="search-results"></div>';   //appears after searching book found
    const container = document.getElementById('search-results');
    results.forEach(book => {
        container.appendChild(book);
    });


    if (results.length === 0) {
        container.innerHTML = '<p>No books found matching your search.</p>';           //if no book found after searching
    }
  setupEventListeners();
}

function addToCart(bookCard) {
    const title = bookCard.getAttribute('data-title');
    const author = bookCard.getAttribute('data-author');       // getting the books based on their title,author...to add them to the cart
    const price = parseFloat(bookCard.getAttribute('data-price'));
    const category = bookCard.getAttribute('data-category');
    const cover = bookCard.querySelector('img').src;

    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {                                               // if the book is already selected and user still add it to the cart, increment it by 1
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({                     // if it's for first time push the books to cart
            title: title,
            author: author,
            price: price,
            category: category,
            cover: cover,
            quantity: 1
        });
    }
    alert(`${title} added to cart!`);
    sessionStorage.setItem('cart', JSON.stringify(cart));   //store the cart in session storage, json.stringify converts the cart to a string
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);   //counting the added books 
     // total and item are parameters for function cart     // reduce combine the result into one 
                                                                        // add total + item quantity or if no any add 1    // 0 ensuers the counting starts from 0
    if (cartCount) {
        cartCount.textContent = count;      //forwarding the updated number to the html ID
    }
}
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    if (!cartItems) return;  // Exit if not book selected return nothing

    cartItems.innerHTML = '';  // Clear previous content
    let total = 0;

    // Create HTML for each cart item
    cart.forEach(item => {
        total += item.price * (item.quantity || 1);  // Calculate running total
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';            //letting the shopping cart have the cover,title,author and price times quantity
        itemDiv.innerHTML = `
            <img src="${item.cover}" alt="${item.title} cover">       
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>by ${item.author}</p>
                <p>$${item.price.toFixed(2)} x ${item.quantity || 1} = $${(item.price * (item.quantity || 1)).toFixed(2)}</p>
            </div>
            <button class="remove-btn" data-title="${item.title}">Remove</button> 
        `;     // giving remove-btn id to let user remove unwanted choice
        cartItems.appendChild(itemDiv);
    });

    if (totalPrice) {
        totalPrice.textContent = total.toFixed(2);   //make sure it has 2 decimal
    }
    document.querySelectorAll('.remove-btn').forEach(btn => {  
        btn.addEventListener('click', function() {       //when remove buttpn is clciked delete the book
            removeFromCart(this.dataset.title);   
        });
    });
}
function removeFromCart(bookTitle) {
    cart = cart.filter(item => item.title !== bookTitle);
     sessionStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

//  for order confirmation html
if (document.getElementById('checkoutBtn')) {
    document.getElementById('checkoutBtn').addEventListener('click', function() {
       window.location.href = 'order-confirmation.html';   //go to confirmation page
           const orderData = {            // Store order data for confirmation page
            items: cart, 
            subtotal: cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
            orderNumber: generateOrderNumber(),   
            orderDate: new Date().toISOString(),  //toisostring returns a date as string using ISO standard
             };
        
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));   //store it as lastorder
        cart = [];
        sessionStorage.removeItem('cart');
        updateCartCount();
          });
}


function generateOrderNumber() {  // a function that generate a random number to the purchased books
    const date = new Date(); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 uses to start january from 1 as human, not 0 as array
    const day = String(date.getDate()).padStart(2, '0');  //ensure its 2 digit, days from 1-9 will have 0 upfront
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); //generate random number
    return `BS${year}${month}${day}${random}`;  //return all the above together as order number
}
// mathfloor does round a number to nearest whole integer eg 4.9 to 4 , -5.4 to -6
// math.random generate number from 0 <= 1 
//tostring does changes the number to string eg 90 to "90"
//padstart make sures the number is 4 digit, if so fine but if not it will add zeros in the beginning till it become at least 4 digit
function displayOrderConfirmation() {
    const orderData = JSON.parse(sessionStorage.getItem('lastOrder'));  //converting the string to javascript object
    if (!orderData) return;
    
    const orderNumberEl = document.getElementById('orderNumber'); //letting the id in html to get the order data
    if (orderNumberEl) {
        orderNumberEl.textContent = orderData.orderNumber;  
    }
     // Display order items
    const orderItemsEl = document.getElementById('orderItems');
    if (orderItemsEl) {
        orderItemsEl.innerHTML = '';
        orderData.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                <div>
                    <strong>${item.title}</strong><br>
                    <small>by ${item.author} - Qty: ${item.quantity || 1}</small>
                </div>
                <div>$${(item.price * (item.quantity || 1)).toFixed(2)}</div>
            `;
            orderItemsEl.appendChild(itemDiv);
        });
    }
    
    // Calculating the total
    const subtotal = orderData.subtotal;
    const shipping = 4.99; //fixed
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    // Update totals
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`; //tofixed obliges the number to have 2 decimal places eg 10 to 10.00
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    // Set delivery date (3-5 business days from now)
    const deliveryDateEl = document.getElementById('deliveryDate');
    if (deliveryDateEl) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
        deliveryDateEl.textContent = deliveryDate.toLocaleDateString('en-US', {
            weekday: 'long',    // to let the date to be in string, eg "Monday"
            year: 'numeric',   //2026
            month: 'long',  // change 1 to january
            day: 'numeric' 
        });
    }
}
  function setupConfirmationPageListeners() {   // let the buttons to navigate
     const c = document.getElementById('continueShoppingBtn');  
     c.addEventListener('click', function() {
                window.location.href = 'main.html';
            });

    const  contnueShoppingBtn2 = document.getElementById('continueShoppingBtn2');  //will let the button to go to main html
     contnueShoppingBtn2.addEventListener('click', function() {
                window.location.href = 'main.html';
            });
            
        } 
      
        function setupScrollAnimations() {                                             //animation fucntion while scrolling
    const observerOptions = {
        threshold: 0.1,  // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px'  // Trigger 50px before element enters viewport
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element comes into view
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);

    // Observe all book cards for drop animation
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        observer.observe(card);
    });

    // Observe category sections for any additional animations
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        observer.observe(category);
    });
}