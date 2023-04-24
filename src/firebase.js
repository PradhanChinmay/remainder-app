import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPfNlGpMSnbX0K1SySjsqJR8CuFRym6lc",
  authDomain: "remainder-app-c9260.firebaseapp.com",
  projectId: "remainder-app-c9260",
  storageBucket: "remainder-app-c9260.appspot.com",
  messagingSenderId: "569697772519",
  appId: "1:569697772519:web:923add529cde30a5acd342"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const auth = getAuth(app);

export { app, db, auth };