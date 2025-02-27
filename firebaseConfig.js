// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtQJbr4Y5V76WOJ2380TkhddNWUzIVQMM",
  authDomain: "racar-database.firebaseapp.com",
  projectId: "racar-database",
  storageBucket: "racar-database.firebasestorage.app",
  messagingSenderId: "520367297731",
  appId: "1:520367297731:web:605bb3fda09e136ed2fe76",
  measurementId: "G-8KTJLQEGL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);