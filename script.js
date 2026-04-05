   // Data Management
        let customers = JSON.parse(localStorage.getItem('shopData')) || [
            { id: 1, total: 0, history: [] },
            { id: 2, total: 0, history: [] },
            { id: 3, total: 0, history: [] },
            { id: 4, total: 0, history: [] },
            { id: 6, total: 0, history: [] }
        ];

        let activeId = null;

        function render() {
            const list = document.getElementById('customer-list');
            list.innerHTML = '';
            
            customers.forEach(c => {
                const card = document.createElement('div');
                card.className = `customer-card ${c.id === activeId ? 'active' : ''}`;
                card.onclick = () => selectPerson(c.id);
                card.innerHTML = `
                    <div class="card-header">
                        <span class="card-name">Person ${c.id}</span>
                        <span class="total-display">Rs ${c.total}</span>
                    </div>
                    <div class="history">${c.history.slice(-3).join(', ') || 'No history'}</div>
                `;
                list.appendChild(card);
            });
            
            updateUI();
            localStorage.setItem('shopData', JSON.stringify(customers));
        }

        function selectPerson(id) {
            activeId = id;
            render();
            const input = document.getElementById('money-input');
            input.focus();
            input.value = '';
        }

        function updateUI() {
            const panel = document.getElementById('control-panel');
            const label = document.getElementById('active-label');
            const totalLabel = document.getElementById('active-total');

            if (activeId === null) {
                panel.className = "input-panel locked";
                label.innerText = "⚠️ SELECT PERSON";
                label.className = "warning";
                totalLabel.innerText = "";
            } else {
                const current = customers.find(c => c.id === activeId);
                panel.className = "input-panel unlocked";
                label.innerText = `PERSON ${activeId}`;
                label.className = "";
                totalLabel.innerText = `Current: Rs ${current.total}`;
            }
        }

        function calc(type) {
            if (activeId === null) return;
            const input = document.getElementById('money-input');
            const val = parseFloat(input.value);
            
            if (isNaN(val) || val <= 0) return;

            const cust = customers.find(c => c.id === activeId);
            if (type === 'add') {
                cust.total += val;
                cust.history.push(`+${val}`);
            } else {
                cust.total -= val;
                cust.history.push(`-${val}`);
            }

            input.value = '';
            activeId = null;
render();
        }

        function resetCurrent() {
  if (activeId === null) return;

  if (confirm(`Clear Person ${activeId}?`)) {
    const cust = customers.find(c => c.id === activeId);
    cust.total = 0;
    cust.history = [];
    activeId = null;
    render();
  
}
        }

        function resetAll() {
            if (confirm("Erase all shop data?")) {
                customers.forEach(c => { c.total = 0; c.history = []; });
                activeId = null;
                render();
            }
        }

        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js');
        }

        render();
