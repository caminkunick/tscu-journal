import React from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/pro-solid-svg-icons';
import { auth } from 'Modules/firebase';

const SignOut = props => {
  const { user } = props;
  const handleSignOut = () => auth().signOut();
  return (<>
    <Typography>
      Welcome,&nbsp;<strong>{ user.displayName || user.email || user.uid }</strong>
    </Typography>
    <Box mb={1} />
    <Button
      fullWidth
      variant="contained"
      color="primary"
      startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
      onClick={handleSignOut}
    >Sign Out</Button>
  </>);
}

export default connect(s=>({user:s.user.data}))(SignOut);