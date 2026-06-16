import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Initialize Firebase Auth with AsyncStorage for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);
