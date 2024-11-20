import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAzY-1xe4cZFt3h4s6kUdVGt2FRnZjq1t0",
  authDomain: "assisfuriatiapp.firebaseapp.com",
  projectId: "assisfuriatiapp",
  storageBucket: "assisfuriatiapp.firebasestorage.app",
  messagingSenderId: "886950448162",
  appId: "1:886950448162:web:572f4d7781d50db6ea0e7b",
  measurementId: "G-9ZYX25P3DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

const db = getFirestore(app);

export { auth, db }; 