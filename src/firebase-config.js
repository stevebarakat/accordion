import {initializeApp} from 'firebase/app';
import {getFirestore} from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCMAL0dbrqEizmFvDMhgRiPdT14o6eyMSU',
  authDomain: 'new-tasks-1ee42.firebaseapp.com',
  projectId: 'new-tasks-1ee42',
  storageBucket: 'new-tasks-1ee42.appspot.com',
  messagingSenderId: '1039237536110',
  appId: '1:1039237536110:web:0eca0dc46604620de1897f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
