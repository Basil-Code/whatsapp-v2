// In v9, Firebase has been modularized for better tree shaking
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKTTKCd2znsmj2C_54VPkYgssqoNASnXU",
  authDomain: "whatsapp-2-c550a.firebaseapp.com",
  projectId: "whatsapp-2-c550a",
  storageBucket: "whatsapp-2-c550a.appspot.com",
  messagingSenderId: "737948816467",
  appId: "1:737948816467:web:fe87d0553bf103fa4162a6",
};

// Initialize Firebase
// check if there's not instance of firebase to protect ourselves when using server side rendering and fast refreshing from next.js to not re-initialize our app a second time

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

//Create an instance of the Google provider object:
const provider = new GoogleAuthProvider();

export { db, auth, provider };
