import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEdwh-ujEdB7BcfNsBICH5t4sdzXxZwW0",
  authDomain: "fb-tut-d39f5.firebaseapp.com",
  projectId: "fb-tut-d39f5",
  storageBucket: "fb-tut-d39f5.appspot.com",
  messagingSenderId: "629835046538",
  appId: "1:629835046538:web:5c93336d531d4b8bb29773",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
