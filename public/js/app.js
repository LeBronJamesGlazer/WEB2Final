const API_URL = '/api';
let myChart = null; // Store chart instance

function toggleForms() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('error-msg').innerText = data.message;
        }
    } catch (err) {
        console.error(err);
    }
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            alert('Registration Successful! Please check your email (simulated).');
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('reg-error-msg').innerText = data.message;
        }
    } catch (err) {
        console.error(err);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

async function loadDashboard() {
    document.getElementById('user-display').innerText = `Welcome, ${localStorage.getItem('username')}`;
    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`${API_URL}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const transactions = data.data;
        
        // 1. Update List
        const list = document.getElementById('list');
        list.innerHTML = '';

        transactions.forEach(transaction => {
            const item = document.createElement('li');
            item.classList.add(transaction.type);
            item.innerHTML = `
                ${transaction.text} <span>${transaction.type === 'income' ? '+' : '-'}$${transaction.amount}</span>
                <button onclick="deleteTransaction('${transaction._id}')" style="background:red;color:white;border:none;cursor:pointer">x</button>
            `;
            list.appendChild(item);
        });

        // 2. Calculate Totals
        const amounts = transactions.map(transaction => transaction.type === 'income' ? transaction.amount : -transaction.amount);
        
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        
        const income = transactions
            .filter(item => item.type === 'income')
            .reduce((acc, item) => (acc += item.amount), 0)
            .toFixed(2);

        const expense = (transactions
            .filter(item => item.type === 'expense')
            .reduce((acc, item) => (acc += item.amount), 0) * -1)
            .toFixed(2);

        // 3. Update UI
        document.getElementById('balance').innerText = `$${total}`;
        document.getElementById('money-plus').innerText = `+$${income}`;
        document.getElementById('money-minus').innerText = `-$${Math.abs(expense)}`;

        // 4. Render Chart
        renderChart(income, Math.abs(expense));

    } catch (err) {
        console.error(err);
    }
}

function renderChart(income, expense) {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // Destroy previous chart if exists
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Financials',
                data: [income, expense],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.6)', // Green
                    'rgba(231, 76, 60, 0.6)'   // Red
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allows height control
        }
    });
}

async function addTransaction() {
    const text = document.getElementById('t-text').value;
    const amount = document.getElementById('t-amount').value;
    const type = document.getElementById('t-type').value;
    const token = localStorage.getItem('token');

    if(!text || !amount) {
        alert('Please fill in fields');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text, amount: Number(amount), type })
        });

        if (res.ok) {
            document.getElementById('t-text').value = '';
            document.getElementById('t-amount').value = '';
            loadDashboard();
        } else {
            const data = await res.json();
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteTransaction(id) {
    const token = localStorage.getItem('token');
    if(confirm('Are you sure?')) {
        try {
            await fetch(`${API_URL}/transactions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadDashboard();
        } catch (err) {
            console.error(err);
        }
    }
}
