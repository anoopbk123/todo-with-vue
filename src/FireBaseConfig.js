// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB69rUAMQeCsj6ntEY4qrkis4x9ny4HRhk",
  authDomain: "todo-vue-task-management-systm.firebaseapp.com",
  projectId: "todo-vue-task-management-systm",
  storageBucket: "todo-vue-task-management-systm.appspot.com",
  messagingSenderId: "592261991140",
  appId: "1:592261991140:web:889a8472509c4be6b37af1",
  measurementId: "G-1TMQXPD7E8"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
export const db = getFirestore(firebaseApp)