// Example Firebase Configuration for LegalVaani
// Copy this file to js/firebase-config.js and replace with your actual values

const firebaseConfig = {
    apiKey: "AIzaSyC_your_actual_api_key_here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

// Initialize Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Export for use in other files
window.auth = auth;
window.googleProvider = googleProvider;