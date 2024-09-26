// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import GoogleAuthProvider

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-Ci1-IsK0VO8E1WgfG-GQrxfRkJDSId0",
  authDomain: "abstore-90dd6.firebaseapp.com",
  projectId: "abstore-90dd6",
  storageBucket: "abstore-90dd6.appspot.com",
  messagingSenderId: "485157800506",
  appId: "1:485157800506:web:e09262814d954433edc303",
  measurementId: "G-NZ58NJKWTL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication
const googleProvider = new GoogleAuthProvider(); // Initialize Google Auth Provider

// Export the necessary variables
export { app, firebaseConfig, analytics, auth, googleProvider }; // Export googleProvider
