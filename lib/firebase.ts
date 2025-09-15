import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnn7chE7cLE57VPhkfflIX_X5B4c76T9s",
  authDomain: "pesira-620dc.firebaseapp.com",
  projectId: "pesira-620dc",
  storageBucket: "pesira-620dc.firebasestorage.app",
  messagingSenderId: "870942666388",
  appId: "1:870942666388:web:30f8bf42582a8d1b1f8e81",
  measurementId: "G-BX0NC8K8FR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;