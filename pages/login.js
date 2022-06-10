import Head from "next/head";
import styled from "styled-components";
import { Button } from "@mui/material";
import { auth, provider } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function Login() {
  const signIn = () => {
    // signInWithPopup(auth, provider).then( (result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const
    // }).catch( (error) => {
    //     alert()
    // })

    signInWithPopup(auth, provider).catch((error) => alert(error.message));
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="/whatsapplogo.png" />
        <Button onClick={signIn} variant="outlined">
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
  );
}
export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  object-fit: contain;
  height: 200px; // 10%
  margin-bottom: 50px;
`;
