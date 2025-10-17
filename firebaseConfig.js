import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBf85HvvCO68sxkoi6lX7N1YGXxnHW1SuQ",
  authDomain: "sprint4-64586.firebaseapp.com",
  projectId: "sprint4-64586",
  storageBucket: "sprint4-64586.firebasestorage.app",
  messagingSenderId: "578776652717",
  appId: "1:578776652717:web:83a8168421258eaa965f24",
  measurementId: "G-67E8R0060L"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;