// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBazXeN5S98J82zkBTzuXCbYN0CD0UM95M",
  authDomain: "mern-task-manager-app-3c8d2.firebaseapp.com",
  projectId: "mern-task-manager-app-3c8d2",
  storageBucket: "mern-task-manager-app-3c8d2.appspot.com", // ✅ fixed
  messagingSenderId: "27133231727",
  appId: "1:27133231727:web:552ca6e32ec5212f10c39a",
  measurementId: "G-JFGV5MCWCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };

