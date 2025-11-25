import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLOWGk-Ow7BYF5nSmy_8ngUy8IUAxM8ik",
  authDomain: "bunkmate-4ccca.firebaseapp.com",
  projectId: "bunkmate-4ccca",
  storageBucket: "bunkmate-4ccca.firebasestorage.app",
  messagingSenderId: "887438338884",
  appId: "1:887438338884:web:fccbcda533305ef91e0511",
  measurementId: "G-0ZKR804PKS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
