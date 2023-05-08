import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVkbcbNr-NI3QKSQdhvTIn7X5ahzadtec",
  authDomain: "nodefirestore-da27b.firebaseapp.com",
  projectId: "nodefirestore-da27b",
  storageBucket: "nodefirestore-da27b.appspot.com",
  messagingSenderId: "299184785002",
  appId: "1:299184785002:web:667b30046877267f97ac13",
  measurementId: "G-8621GPF5CE",
};

const app = initializeApp(firebaseConfig);
const authO = getAuth(app);
const provider = new GoogleAuthProvider();
const provider1 = new FacebookAuthProvider();
export { authO, provider, provider1 };
