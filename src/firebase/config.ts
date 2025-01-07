import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBuEdqadQgAKteZNs8X6WMxswtWeTOaHo4",
  authDomain: "tourism-education.firebaseapp.com",
  projectId: "tourism-education",
  storageBucket: "tourism-education.appspot.com",
  messagingSenderId: "305357411084",
  appId: "1:305357411084:web:d48da87e63ae2c6610ef29",
  measurementId: "G-XERXZJ7L0G"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Auth 초기화
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Firestore 초기화
export const db = getFirestore(app);

// Analytics 초기화
export const analytics = getAnalytics(app); 