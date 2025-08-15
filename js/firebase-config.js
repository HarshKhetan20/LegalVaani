// Firebase Configuration for LegalVaani
// Using Firebase Compat Library (v9)

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_API_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
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
