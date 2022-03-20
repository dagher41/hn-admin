// LoginPage.js
import { Fragment } from "react";
import { Login } from "react-admin";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from "firebase/compat/app";

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // signInSuccessUrl: '#/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: async (result) => {
      const idToken = await result.user._delegate.auth.currentUser.getIdToken();
      localStorage.setItem('idToken', idToken)
      localStorage.setItem('userUid', result.user._delegate.uid)
      window.location.assign('#/');
      return false
    }
  }
};

const SignInScreen = () => <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>;

const CustomLoginForm = props => (
  <Fragment>
    <div style={{textAlign: "center"}}>Select your sign in option</div>
    <SignInScreen />
  </Fragment>
);

const CustomLoginPage = props => (
    <Login {...props}>
      <CustomLoginForm {...props}/>
    </Login>
);

export default CustomLoginPage;