// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
require("firebase/app");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVkbcbNr-NI3QKSQdhvTIn7X5ahzadtec",
  authDomain: "nodefirestore-da27b.firebaseapp.com",
  projectId: "nodefirestore-da27b",
  storageBucket: "nodefirestore-da27b.appspot.com",
  messagingSenderId: "299184785002",
  appId: "1:299184785002:web:667b30046877267f97ac13",
  measurementId: "G-8621GPF5CE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = { app };
