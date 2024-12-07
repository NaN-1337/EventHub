// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOYfEHuMuqIyXORb858W_Zodxyduyojek",
  authDomain: "hackitall-db-2024-70ec3.firebaseapp.com",
  projectId: "hackitall-db-2024-70ec3",
  storageBucket: "hackitall-db-2024-70ec3.firebasestorage.app",
  messagingSenderId: "1055556258540",
  appId: "1:1055556258540:web:c19acba458c8a950d533c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);