import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrPyojqgeG5rQZ8qI88EYlgm3_wMEJumk",
  authDomain: "calorietracker-869fc.firebaseapp.com",
  projectId: "calorietracker-869fc",
  storageBucket: "calorietracker-869fc.firebasestorage.app",
  messagingSenderId: "740063528317",
  appId: "1:740063528317:web:7a9cbf8c1f3f5264ee3814"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
