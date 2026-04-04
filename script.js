let customers = JSON.parse(localStorage.getItem('shopData')) || [
    { id: 1, total: 0, history: [] },
    { id: 2, total: 0, history: [] },
    { id: 3, total: 0, history: [] },
    { id: 4, total: 0, history: [] },
    { id: 5, total: 0, history: [] }
];

let activeId = 1;

function init() {
    const list = document.getElementById('customer-list');
    list.innerHTML = '';
    
    customers.forEach(c => {
        const card = document.createElement('div');
        card.className = `customer-card ${c.id === activeId ? 'active' : ''}`;
        
        // When you tap the card, it sets active AND focuses the input
        card.onclick = () => {
            setActive(c.id);
        };

        card.innerHTML = `
            <div class="card-header">
                <span>Person ${c.id}</span>
                <span class="total-display">Rs ${c.total}</span>
            </div>
            <div class="history">History: ${c.history.join(', ') || 'No entries'}</div>
        `;
        list.appendChild(card);
    });
    
    updatePanelInfo();
    saveData();
}

function setActive(id) {
    activeId = id;
    init();
    
    // THE FIX: Automatically focus the input and show keyboard
    const inputField = document.getElementById('money-input');
    inputField.focus();
    
    // Optional: Clear previous value if any for a fresh start
    inputField.value = ''; 
}

function updatePanelInfo() {
    const activeCust = customers.find(c => c.id === activeId);
    document.getElementById('active-label').innerText = `Selecting: Person ${activeId}`;
    document.getElementById('current-sum').innerText = `Total: Rs ${activeCust.total}`;
}

function updateTotal(type) {
    const input = document.getElementById('money-input');
    const val = parseFloat(input.value);
    
    if (isNaN(val)) {
        input.focus(); // Keep focus if they press button without number
        return;
    }

    const cust = customers.find(c => c.id === activeId);
    
    if (type === 'add') {
        cust.total += val;
        cust.history.push(`+${val}`);
    } else {
        cust.total -= val;
        cust.history.push(`-${val}`);
    }

    input.value = '';
    input.focus(); // Keep keyboard open for the next item from same customer
    init();
}

function clearCurrent() {
    if(confirm("Clear history for this person?")) {
        const cust = customers.find(c => c.id === activeId);
        cust.total = 0;
        cust.history = [];
        init();
        document.getElementById('money-input').focus();
    }
}

function resetAll() {
    if(confirm("Are you sure you want to clear ALL customers?")) {
        customers.forEach(c => {
            c.total = 0;
            c.history = [];
        });
        init();
    }
}

function saveData() {
    localStorage.setItem('shopData', JSON.stringify(customers));
}

// Initial load
init();
          
