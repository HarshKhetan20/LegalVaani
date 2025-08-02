// Firebase Configuration for LegalVaani
// Using Firebase Compat Library (v9)

const firebaseConfig = {
  apiKey: "AIzaSyDwgeK32fVl6gWK99IiO5TdxP1aoRnmYKM",
  authDomain: "legalvaani.firebaseapp.com",
  projectId: "legalvaani",
  storageBucket: "legalvaani.firebasestorage.app",
  messagingSenderId: "864855352558",
  appId: "1:864855352558:web:362e9cd065a27cbab43fff",
  measurementId: "G-2MR37TLZJG"
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