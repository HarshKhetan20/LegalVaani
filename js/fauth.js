// Firebase Authentication for LegalVaani

let currentUser = null;

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            currentUser = user;
            updateUIForLoggedInUser(user);
            console.log('User logged in:', user.email);
        } else {
            // User is signed out
            currentUser = null;
            updateUIForLoggedOutUser();
            console.log('User logged out');
        }
    });
});

// Update auth state handler
firebase.auth().onAuthStateChanged((user) => {
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.querySelector('.user-info');
    const profileIcon = document.querySelector('.profile-icon');

    if (user) {
        // User is logged in
        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (profileIcon) {
            profileIcon.style.display = 'flex';
            profileIcon.querySelector('a').href = 'profile.html';
        }
    } else {
        // User is logged out
        if (authButtons) authButtons.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
        if (profileIcon) profileIcon.style.display = 'none';
    }
});

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.querySelector('.user-info');
    
    if (authButtons) {
        authButtons.style.display = 'none';
    }
    
    if (userInfo) {
        userInfo.style.display = 'flex';
        userInfo.innerHTML = `
            <span class="user-email">Welcome, ${user.email}</span>
            <button class="btn btn-secondary btn-sm" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
    }
    
    // Show protected content
    const protectedContent = document.querySelectorAll('.protected-content');
    protectedContent.forEach(element => {
        element.style.display = 'block';
    });
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.querySelector('.user-info');
    
    if (authButtons) {
        authButtons.style.display = 'flex';
    }
    
    if (userInfo) {
        userInfo.style.display = 'none';
    }
    
    // Hide protected content
    const protectedContent = document.querySelectorAll('.protected-content');
    protectedContent.forEach(element => {
        element.style.display = 'none';
    });
}

// Sign up function
async function signup(email, password) {
    try {
        showNotification('Creating account...', 'info');
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        showNotification('Account created successfully!', 'success');
        closeAuthModal();
        
        return user;
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'An error occurred during signup.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password should be at least 6 characters long.';
                break;
        }
        
        showNotification(errorMessage, 'error');
        throw error;
    }
}

// Login function
async function login(email, password) {
    try {
        showNotification('Logging in...', 'info');
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        showNotification('Logged in successfully!', 'success');
        closeAuthModal();
        
        return user;
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'An error occurred during login.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email address.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
        }
        
        showNotification(errorMessage, 'error');
        throw error;
    }
}

// Google Sign In function
async function signInWithGoogle() {
    try {
        showNotification('Signing in with Google...', 'info');
        
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        showNotification('Signed in with Google successfully!', 'success');
        closeAuthModal();
        
        return user;
    } catch (error) {
        console.error('Google sign in error:', error);
        let errorMessage = 'An error occurred during Google sign in.';
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = 'Sign in was cancelled.';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'Sign in popup was blocked. Please allow popups for this site.';
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
                break;
        }
        
        showNotification(errorMessage, 'error');
        throw error;
    }
}

// Logout function
async function logout() {
    try {
        await auth.signOut();
        showNotification('Logged out successfully!', 'success');
        
        // Redirect to index page if on a protected page
        if (window.location.pathname.includes('generator.html')) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Error logging out. Please try again.', 'error');
    }
}

// Change password function
async function changePassword(newPassword) {
    try {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        
        showNotification('Changing password...', 'info');
        
        await currentUser.updatePassword(newPassword);
        
        showNotification('Password changed successfully!', 'success');
    } catch (error) {
        console.error('Change password error:', error);
        let errorMessage = 'An error occurred while changing the password.';
        
        switch (error.code) {
            case 'auth/weak-password':
                errorMessage = 'Password should be at least 6 characters long.';
                break;
            case 'auth/requires-recent-login':
                errorMessage = 'Please re-login to change your password.';
                break;
        }
        
        showNotification(errorMessage, 'error');
        throw error;
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validation
    if (!email || !password || !confirmPassword) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    signup(email, password);
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validation
    if (!email || !password) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    login(email, password);
}

// Show auth modal
function showAuthModal(type) {
    const modal = document.getElementById('auth-modal');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const authSwitchText = document.getElementById('auth-switch-text');
    
    if (type === 'signup') {
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
        document.getElementById('auth-modal-title').textContent = 'Create Account';
        authSwitchText.innerHTML = 'Already have an account? <a href="#" onclick="showAuthModal(\'login\')">Login</a>';
    } else {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        document.getElementById('auth-modal-title').textContent = 'Login';
        authSwitchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="showAuthModal(\'signup\')">Sign up</a>';
    }
    
    modal.style.display = 'flex';
}

// Close auth modal
function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'none';
    
    // Clear form fields
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm-password').value = '';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Require authentication for protected pages
function requireAuth() {
    if (!isAuthenticated()) {
        showNotification('Please login to access this feature.', 'warning');
        showAuthModal('login');
        return false;
    }
    return true;
}

// Export functions for use in other files
window.signup = signup;
window.login = login;
window.logout = logout;
window.signInWithGoogle = signInWithGoogle;
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.isAuthenticated = isAuthenticated;
window.requireAuth = requireAuth;
window.changePassword = changePassword;