import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./login";
import Loading from "../components/Loading";
import { useEffect } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

// Where the whole thing starts
function MyApp({ Component, pageProps }) {
  // useAuthState() -> it says to firebase is there a user logged in right now
  // Retrieve and monitor the authentication state from Firebase.
  const [user, loading] = useAuthState(auth);

  // tracking the user status (online or not)
  useEffect(() => {
    if (user) {
      // setDoc(docReference, Payload) -> updates doc if exist, if not create it
      setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email, // from email from gmail signed-in
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL, // from gmail photoURL
          // merge to not update the whole document just simply merged into an existing document (updates these properties only)
        },
        { merge: true }
      );
    }
  }, [user]);

  // Controlling the loading when the app refresh instead of go through login page then back to the app
  if (loading) return <Loading />;
  // if no user render the login page
  if (!user) return <Login />;

  // Component -> u can refer to it as the pointer which we start routing
  return <Component {...pageProps} />;
}

export default MyApp;
