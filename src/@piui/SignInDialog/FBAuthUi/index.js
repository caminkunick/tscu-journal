import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { firebase, auth } from 'Modules/firebase';
import './index.scss'

const FBAuthUi = props => {
  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
//      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: async (user) => {
        
      }
    }
  };

  return <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={auth}
    style={{padding:32}}
  />
}

export default FBAuthUi;
