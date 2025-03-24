// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYlsyk9fZsvXl_Kig69Vj4gxmBXD-0gjU",
  authDomain: "chatapp-be99b.firebaseapp.com",
  projectId: "chatapp-be99b",
  storageBucket: "chatapp-be99b.firebasestorage.app",
  messagingSenderId: "71932094507",
  appId: "1:71932094507:web:2eb9ec6657076c01f1226e",
  measurementId: "G-420TWEYEJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// const authInit = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// })

export { db, auth }