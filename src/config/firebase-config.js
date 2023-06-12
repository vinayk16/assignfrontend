// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFW9NQOju5imf1KEZdTIdUAR3AdWrcFGc",
  authDomain: "webapp-d25a4.firebaseapp.com",
  projectId: "webapp-d25a4",
  storageBucket: "webapp-d25a4.appspot.com",
  messagingSenderId: "877490734785",
  appId: "1:877490734785:web:5e0e6b432ce163d409f640",
  measurementId: "G-4DPC3YNCGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);