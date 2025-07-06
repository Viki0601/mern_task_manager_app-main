import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "todo-task-manager-68372.firebaseapp.com",
  projectId: "todo-task-manager-68372",
  storageBucket: "todo-task-manager-68372.appspot.com",
  messagingSenderId: "979959198551",
  appId: "1:979959198551:web:a6f8f567195fb965220412",
  measurementId: "G-PJSRCWCKVQ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };
