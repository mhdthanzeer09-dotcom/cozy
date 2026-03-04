// Authentication System

class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    register(name, email, password, confirmPassword) {
        if (!name || !email || !password || !confirmPassword) {
            return { success: false, message: 'All fields are required' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }

        if (this.users[email]) {
            return { success: false, message: 'Email already registered' };
        }

        const hashedPassword = this.hashPassword(password);

        this.users[email] = {
            name: name,
            email: email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('users', JSON.stringify(this.users));
        return { success: true, message: 'Account created successfully' };
    }

    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }

        const user = this.users[email];
        if (!user) {
            return { success: false, message: 'Email not found' };
        }

        const hashedPassword = this.hashPassword(password);
        if (user.password !== hashedPassword) {
            return { success: false, message: 'Incorrect password' };
        }

        this.currentUser = {
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        };

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return { success: true, message: 'Login successful' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(16);
    }
}

const authManager = new AuthManager();

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const errorMessageDiv = document.getElementById('errorMessage');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = authManager.login(email, password);

        if (result.success) {
            showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError(result.message);
        }
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirm').value;

        const result = authManager.register(name, email, password, confirmPassword);

        if (result.success) {
            showSuccess('Account created! Logging in...');
            setTimeout(() => {
                authManager.login(email, password);
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError(result.message);
        }
    });
}

function toggleForms() {
    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');
    errorMessageDiv.classList.remove('show');
}

function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.classList.add('show');
    setTimeout(() => {
        errorMessageDiv.classList.remove('show');
    }, 4000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;
    errorMessageDiv.parentElement.appendChild(successDiv);
}