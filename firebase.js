// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwn51a935SI1koOvS4eaTI8eHppq9jOPM",
  authDomain: "factura2-614c0.firebaseapp.com",
  projectId: "factura2-614c0",
  storageBucket: "factura2-614c0.appspot.com",
  messagingSenderId: "1057596117770",
  appId: "1:1057596117770:web:f67a5830b4e3cdb174e0f3",
  measurementId: "G-5VVEEBH2P1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
