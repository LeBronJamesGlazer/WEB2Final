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
            localStorage.setItem('role', data.role); // Save role for UI logic
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
            localStorage.setItem('role', data.role); // Save role
            alert('Registration Successful! Please check your email.');
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
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}

function initNav() {
    const header = document.querySelector('header');
    let nav = header.querySelector('nav');
    
    // If nav exists (added manually in HTML), clear it. If not, create it.
    if (!nav) {
        nav = document.createElement('nav');
        nav.style.display = 'inline-block';
        nav.style.marginLeft = '20px';
        const logoutBtn = header.querySelector('button');
        header.insertBefore(nav, logoutBtn);
    }
    nav.innerHTML = '';
    
    nav.innerHTML += `<a href="dashboard.html" style="color: white; margin-right: 15px;">Dashboard</a>`;
    nav.innerHTML += `<a href="profile.html" style="color: white; margin-right: 15px;">Profile</a>`;
    nav.innerHTML += `<a href="reports.html" style="color: white; margin-right: 15px;">Reports</a>`;

    const role = localStorage.getItem('role');
    if (role === 'admin') {
        nav.innerHTML += `<a href="admin.html" style="color: white; margin-right: 15px;">Admin</a>`;
        nav.innerHTML += `<a href="premium.html" style="color: white; margin-right: 15px;">Premium</a>`;
    } else if (role === 'premium') {
        nav.innerHTML += `<a href="premium.html" style="color: white; margin-right: 15px;">Premium</a>`;
    }
}

async function loadDashboard() {
    document.getElementById('user-display').innerText = `Welcome, ${localStorage.getItem('username')}`;
    const token = localStorage.getItem('token');

    initNav(); // Use shared nav logic

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
            const date = new Date(transaction.createdAt).toLocaleDateString();
            const item = document.createElement('li');
            item.classList.add(transaction.type);
            item.innerHTML = `
                <div class="info">
                    <span>${transaction.text}</span>
                    <small>${date}</small>
                </div>
                <div>
                    <span>${transaction.type === 'income' ? '+' : '-'}$${transaction.amount}</span>
                    <button class="delete-btn" onclick="deleteTransaction('${transaction._id}')">x</button>
                </div>
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

// Admin Page Function
async function loadAdminUsers() {
    initNav();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if(role !== 'admin') {
        document.getElementById('admin-msg').innerText = 'Access Denied. Admins only.';
        document.getElementById('admin-msg').style.color = 'red';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
             throw new Error('Failed to fetch users');
        }

        const users = await res.json();
        const tbody = document.getElementById('user-table-body');
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">${user._id}</td>
                    <td style="padding: 10px;">${user.username}</td>
                    <td style="padding: 10px;">${user.email}</td>
                    <td style="padding: 10px;">${user.role}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (err) {
        console.error(err);
        document.getElementById('admin-msg').innerText = 'Error loading users.';
        document.getElementById('admin-msg').style.color = 'red';
    }
}

// Premium Page Function
async function loadPremiumContent() {
    initNav();
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch(`${API_URL}/premium/content`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 403) {
            document.getElementById('premium-error').innerText = 'Access Denied. Premium subscription required.';
            document.getElementById('premium-error').style.display = 'block';
            document.getElementById('premium-desc').style.display = 'none';
            return;
        }

        const data = await res.json();
        
        document.getElementById('premium-title').innerText = data.title;
        document.getElementById('premium-desc').innerText = data.description;
        document.getElementById('premium-chart-container').style.display = 'block';

        // Render Premium Chart (Multi-bar: Income vs Expense)
        const ctx = document.getElementById('premiumChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.chartLabels,
                datasets: [
                    {
                        label: 'Income',
                        data: data.chartDataIncome,
                        backgroundColor: 'rgba(46, 204, 113, 0.6)'
                    },
                    {
                        label: 'Expense',
                        data: data.chartDataExpense,
                        backgroundColor: 'rgba(231, 76, 60, 0.6)'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

    } catch (err) {
        console.error(err);
        document.getElementById('premium-error').innerText = 'Error loading content.';
        document.getElementById('premium-error').style.display = 'block';
    }
}

// Reports Page Function
async function generateReport() {
    const start = document.getElementById('r-start').value;
    const end = document.getElementById('r-end').value;
    const token = localStorage.getItem('token');

    if(!start || !end) {
        alert('Please select dates');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/transactions/report?startDate=${start}&endDate=${end}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        
        if(result.success) {
            document.getElementById('report-results').style.display = 'block';
            document.getElementById('r-income').innerText = `+$${result.summary.totalIncome}`;
            document.getElementById('r-expense').innerText = `-$${result.summary.totalExpense}`;
            document.getElementById('r-net').innerText = `$${result.summary.net}`;
            
            const tbody = document.getElementById('report-body');
            tbody.innerHTML = '';
            
            result.data.forEach(t => {
                const row = `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px;">${new Date(t.createdAt).toLocaleDateString()}</td>
                        <td style="padding: 10px;">${t.text}</td>
                        <td style="padding: 10px; color: ${t.type==='income'?'green':'red'}">${t.type}</td>
                        <td style="padding: 10px;">$${t.amount}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
    } catch(err) {
        console.error(err);
        alert('Error generating report');
    }
}

// Profile Page Functions
async function loadProfile() {
    initNav();
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/users/profile`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await res.json();
        
        document.getElementById('p-username').value = user.username;
        document.getElementById('p-email').value = user.email;
        document.getElementById('p-role').value = user.role;
    } catch (err) {
        console.error(err);
    }
}

async function updateProfile() {
    const token = localStorage.getItem('token');
    const username = document.getElementById('p-username').value;
    const email = document.getElementById('p-email').value;

    try {
        const res = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username, email })
        });

        if (res.ok) {
            document.getElementById('profile-msg').innerText = 'Profile Updated Successfully!';
            localStorage.setItem('username', username); // Update local storage
        } else {
            document.getElementById('profile-msg').innerText = 'Update Failed';
            document.getElementById('profile-msg').style.color = 'red';
        }
    } catch (err) {
        console.error(err);
    }
}