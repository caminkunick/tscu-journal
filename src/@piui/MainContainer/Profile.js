import React, { forwardRef } from 'react';
import { connect } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Slide,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/pro-solid-svg-icons';
import { auth } from 'Modules/firebase';

const Transition = forwardRef((props,ref)=><Slide direction="down" ref={ref} {...props} />)

const Profile = props => {
  const { user } = props;
  const [ state, setState ] = React.useState({
    open: false,
    displayName: '',
  });
  
  
  const handleOpen = open => () => setState(s=>({ ...s, open }));
  const handleSignOut = () => {
    auth.signOut()
  }
  
  
  React.useEffect(()=>{
    if(user){
      setState(s=>({
        ...s,
        displayName: user.displayName || user.email || user.uid,
      }))
    } else {
      setState({
        open: false,
        displayName: '',
      })
    }
  }, [ user ])
  
  return user
    ? (<>
      <IconButton edge="end" onClick={handleOpen(true)} title={state.displayName}>
        <Avatar src={user.photoURL} />
      </IconButton>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={state.open}
        onClose={handleOpen(false)}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Avatar src={user.photoURL} style={{width:128,height:128}} />
            <Box mt={1}>
              <Typography variant="h6"><b>{state.displayName}</b></Typography>
            </Box>
          </Box>
        </DialogContent>
        <Button variant="contained" color="secondary" fullWidth size="large" onClick={handleSignOut}
          startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
          style={{borderRadius:0}}
          disableElevation
        >Sign Out</Button>
      </Dialog>
    </>)
    : null
}

export default connect(s=>({
  user: s.user.data,
}))(Profile);