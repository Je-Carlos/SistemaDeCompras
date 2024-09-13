// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByJJOwW8tXKNbCaVT_WLTe-MhQ5d9SwdU",
  authDomain: "react-3d2b8.firebaseapp.com",
  databaseURL: "https://react-3d2b8-default-rtdb.firebaseio.com/", // Adicione a URL do banco de dados aqui
  projectId: "react-3d2b8",
  storageBucket: "react-3d2b8.appspot.com",
  messagingSenderId: "1087330933061",
  appId: "1:1087330933061:web:94f3777fe3431df977c62c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, app, db, database };
