// API Configuration
// const API_BASE = '/api';
const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://expenebackend.vercel.app/api';

// State
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let categoryChart = null;
let monthlyChart = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    if (authToken) {
        verifyToken();
    }
});

// Initialize app
function initializeApp() {
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
}

// Setup event listeners
function setupEventListeners() {
    // Auth buttons
    const showLoginBtn = document.getElementById('show-login');
    const showRegisterBtn = document.getElementById('show-register');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            console.log('Login button clicked');
            showAuthModal('login');
        });
    }
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => {
            console.log('Register button clicked');
            showAuthModal('register');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAuthModal);
    }
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeAuthModal);
    }
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('auth-modal');
        if (e.target === modal) {
            closeAuthModal();
        }
    });

    // Auth form
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            console.log('Auth form submitted');
            handleAuth(e);
        });
    } else {
        console.error('Auth form not found!');
    }

    // Expense form
    document.getElementById('expense-form').addEventListener('submit', handleAddExpense);

    // Filters
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
}

// Auth functions
function showAuthModal(mode) {
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('modal-title');
    const usernameField = document.getElementById('username-field');
    const emailField = document.getElementById('email-field');
    const authUsername = document.getElementById('auth-username');
    const form = document.getElementById('auth-form');

    if (!mode) {
        console.error('showAuthModal called without mode');
        return;
    }

    form.reset();
    document.getElementById('error-message').textContent = '';

    if (mode === 'register') {
        title.textContent = 'Register';
        usernameField.classList.remove('hidden');
        usernameField.classList.add('block');
        emailField.classList.remove('hidden');
        emailField.classList.add('block');
        authUsername.classList.add('hidden');
        authUsername.removeAttribute('required');
        document.getElementById('reg-username').setAttribute('required', '');
        document.getElementById('reg-email').setAttribute('required', '');
    } else {
        title.textContent = 'Login';
        usernameField.classList.add('hidden');
        emailField.classList.add('hidden');
        authUsername.classList.remove('hidden');
        authUsername.setAttribute('required', '');
        document.getElementById('reg-username').removeAttribute('required');
        document.getElementById('reg-email').removeAttribute('required');
    }

    modal.classList.remove('hidden');
    modal.dataset.mode = mode;
    console.log('Modal opened with mode:', mode);
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

async function handleAuth(e) {
    e.preventDefault();
    const modal = document.getElementById('auth-modal');
    const mode = modal.dataset.mode;
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = '';

    if (!mode) {
        errorDiv.textContent = 'Please select login or register';
        return;
    }

    let data = {};
    if (mode === 'register') {
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !email || !password) {
            errorDiv.textContent = 'All fields are required';
            return;
        }

        data = {
            username,
            email,
            password,
        };
    } else {
        const username = document.getElementById('auth-username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            errorDiv.textContent = 'Username and password are required';
            return;
        }

        data = {
            username,
            password,
        };
    }

    try {
        console.log('Sending auth request:', mode, data);
        const response = await fetch(`${API_BASE}/auth/${mode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.errors?.[0]?.msg || 'Authentication failed');
        }

        authToken = result.token;
        currentUser = result.user;
        localStorage.setItem('authToken', authToken);

        closeAuthModal();
        showMainContent();
        loadExpenses();
        loadStats();
    } catch (error) {
        console.error('Auth error:', error);
        errorDiv.textContent = error.message;
    }
}

async function verifyToken() {
    try {
        const response = await fetch(`${API_BASE}/expenses`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (response.ok) {
            const expenses = await response.json();
            // Token is valid, get user info from expenses or make a separate call
            showMainContent();
            loadExpenses();
            loadStats();
        } else {
            logout();
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        logout();
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    document.getElementById('auth-buttons').classList.remove('hidden');
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('main-content').classList.add('hidden');
    if (categoryChart) categoryChart.destroy();
    if (monthlyChart) monthlyChart.destroy();
}

function showMainContent() {
    document.getElementById('auth-buttons').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-info').classList.add('flex');
    document.getElementById('main-content').classList.remove('hidden');
    if (currentUser) {
        document.getElementById('username-display').textContent = currentUser.username;
    }
}

// Expense functions
async function handleAddExpense(e) {
    e.preventDefault();

    const expense = {
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
    };

    try {
        const response = await fetch(`${API_BASE}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(expense),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add expense');
        }

        document.getElementById('expense-form').reset();
        document.getElementById('date').valueAsDate = new Date();
        loadExpenses();
        loadStats();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function loadExpenses() {
    try {
        const filters = getFilters();
        let url = `${API_BASE}/expenses`;
        const params = new URLSearchParams();
        
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.category) params.append('category', filters.category);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) throw new Error('Failed to load expenses');

        const expenses = await response.json();
        displayExpenses(expenses);
        updateCategoryFilter(expenses);
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

function displayExpenses(expenses) {
    const list = document.getElementById('expenses-list');
    
    if (expenses.length === 0) {
        list.innerHTML = '<div class="text-center py-10 text-gray-500"><p class="text-lg">No expenses found. Add your first expense above!</p></div>';
        return;
    }

    list.innerHTML = expenses.map(expense => `
        <div class="bg-gray-50 p-4 rounded-lg mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-l-4 border-primary-500 hover:shadow-md hover:translate-x-1 transition-all duration-200">
            <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-900 mb-2">${expense.description}</h4>
                <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span><strong class="font-semibold">Category:</strong> ${expense.category}</span>
                    <span><strong class="font-semibold">Date:</strong> ${new Date(expense.date).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <div class="text-2xl font-bold text-red-600">$${parseFloat(expense.amount).toFixed(2)}</div>
                <div class="flex gap-2">
                    <button class="btn btn-secondary btn-small" onclick="editExpense(${expense.id})">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteExpense(${expense.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
        const response = await fetch(`${API_BASE}/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) throw new Error('Failed to delete expense');

        loadExpenses();
        loadStats();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function editExpense(id) {
    try {
        const response = await fetch(`${API_BASE}/expenses/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) throw new Error('Failed to load expense');

        const expense = await response.json();
        
        // Populate form
        document.getElementById('amount').value = expense.amount;
        document.getElementById('description').value = expense.description;
        document.getElementById('category').value = expense.category;
        document.getElementById('date').value = expense.date;

        // Scroll to form
        document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });

        // Change form to update mode
        const form = document.getElementById('expense-form');
        form.dataset.editId = id;
        form.querySelector('button[type="submit"]').textContent = 'Update Expense';

        // Update form handler
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updateExpense(id);
        };
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function updateExpense(id) {
    const expense = {
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
    };

    try {
        const response = await fetch(`${API_BASE}/expenses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(expense),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update expense');
        }

        // Reset form
        document.getElementById('expense-form').reset();
        document.getElementById('expense-form').dataset.editId = '';
        document.getElementById('expense-form').querySelector('button[type="submit"]').textContent = 'Add Expense';
        document.getElementById('expense-form').onsubmit = handleAddExpense;
        document.getElementById('date').valueAsDate = new Date();

        loadExpenses();
        loadStats();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Statistics and Charts
async function loadStats() {
    try {
        const filters = getFilters();
        let url = `${API_BASE}/expenses/stats`;
        const params = new URLSearchParams();
        
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) throw new Error('Failed to load statistics');

        const stats = await response.json();
        displayStats(stats);
        updateCharts(stats);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function displayStats(stats) {
    document.getElementById('total-expenses').textContent = `$${stats.total.toFixed(2)}`;
    
    // Calculate this month's expenses
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthData = stats.monthly.find(m => m.month === thisMonth);
    const monthTotal = monthData ? monthData.total : 0;
    document.getElementById('month-expenses').textContent = `$${monthTotal.toFixed(2)}`;
}

function updateCharts(stats) {
    // Category Chart
    const categoryCtx = document.getElementById('category-chart').getContext('2d');
    if (categoryChart) categoryChart.destroy();

    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: stats.byCategory.map(c => c.category),
            datasets: [{
                data: stats.byCategory.map(c => c.total),
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#4facfe',
                    '#00f2fe',
                    '#43e97b',
                    '#fa709a',
                    '#fee140',
                ],
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });

    // Monthly Chart
    const monthlyCtx = document.getElementById('monthly-chart').getContext('2d');
    if (monthlyChart) monthlyChart.destroy();

    const sortedMonthly = [...stats.monthly].reverse();
    monthlyChart = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: sortedMonthly.map(m => m.month),
            datasets: [{
                label: 'Monthly Expenses',
                data: sortedMonthly.map(m => m.total),
                backgroundColor: '#667eea',
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Filters
function getFilters() {
    return {
        startDate: document.getElementById('filter-start-date').value || null,
        endDate: document.getElementById('filter-end-date').value || null,
        category: document.getElementById('filter-category').value || null,
    };
}

function applyFilters() {
    loadExpenses();
    loadStats();
}

function clearFilters() {
    document.getElementById('filter-start-date').value = '';
    document.getElementById('filter-end-date').value = '';
    document.getElementById('filter-category').value = '';
    loadExpenses();
    loadStats();
}

function updateCategoryFilter(expenses) {
    const categories = [...new Set(expenses.map(e => e.category))].sort();
    const select = document.getElementById('filter-category');
    const currentValue = select.value;
    
    // Keep "All Categories" option
    select.innerHTML = '<option value="">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    
    // Restore previous selection if it still exists
    if (categories.includes(currentValue)) {
        select.value = currentValue;
    }
}

