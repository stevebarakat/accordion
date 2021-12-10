import {initializeApp} from 'firebase/app';
import {getFirestore} from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAqBktTBl4w2EFtuyg5lnWXEA5IUbdpJSM',
  authDomain: 'new-tasks.firebaseapp.com',
  projectId: 'new-tasks',
  storageBucket: 'new-tasks.appspot.com',
  messagingSenderId: '1012795103379',
  appId: '1:1012795103379:web:bf7c31654d34b4f0a41566',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
