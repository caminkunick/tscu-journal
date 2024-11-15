import React from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSignInAlt, faUserPlus, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import FBAuthUi from '../FBAuthUi';
import { auth } from 'Modules/firebase';


const SignInBox = ({ children, onTabChange, ...props }) => {
  const [ data, setData ] = React.useState({
    email: "",
    password: "",
  });
  const [ state, setState ] = React.useState({
    showpass: false,
    fetching: false,
    error: false,
    msg: "",
  })
  
  
  const isComplete = () => (data.email && data.password);
  const handleChange = (key,value) => () => setState(s=>({ ...s, [key]:value }));
  const handleInputChange = key => ({ target }) => setData(d=>({ ...d, [key]:target.value }));
  const handleSignIn = () => {
    setState(s=>({ ...s, fetching:true, error:false, msg:'' }));
    const { email, password } = data;
    auth.signInWithEmailAndPassword(email,password)
      .then(result=>setState(s=>({
        ...s,
        fetching: false,
        error: false,
        msg: '',
      })))
      .catch(error=>setState(s=>({
        ...s,
        fetching: false,
        error: true,
        msg: error.message
      })))
  }

  
  const getProps = name => ({
    fullWidth: true,
    variant: "outlined",
    value: data[name],
    onChange: handleInputChange(name),
    disabled: state.fetching,
  })
  
  
  return (<Box px={3} py={6} {...props}>
    <FBAuthUi />
    <Box my={3} children={<Divider />} />
    <TextField label="Email" {...getProps("email")} />
    <Box mb={2} />
    <Box display="flex" alignItems="center" mb={2}>
      <TextField
        label="Password"
        type={state.showpass ? "text": "password"}
        {...getProps("password")}
      />
      <IconButton onClick={handleChange('showpass',!state.showpass)} style={{maxWidth:48,marginLeft:8}}>
        <FontAwesomeIcon icon={state.showpass ? faEyeSlash : faEye} />
      </IconButton>
    </Box>
    { state.error && (<Typography variant="caption" color="error" paragraph>{ state.msg }</Typography>) }
    {
      state.fetching
        ? (<Button variant="contained" fullWidth color="primary" size="large" disabled
          startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}
        >Please wait</Button>)
        : (
          isComplete()
            ? <Button variant="contained" fullWidth color="primary" size="large" onClick={handleSignIn}
              startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
            >Sign In</Button>
            : <Button variant="contained" fullWidth color="primary" size="large" disabled
              startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
            >Sign In</Button>
        )
    }
    {
      
    }
    <Box display="flex" my={2} alignItems="center">
      <Box flexGrow={1} children={<Divider />} />
      <Box px={2}>OR</Box>
      <Box flexGrow={1} children={<Divider />} />
    </Box>
    <Button variant="outlined" fullWidth onClick={onTabChange('regist')}
      startIcon={<FontAwesomeIcon icon={faUserPlus} />}
    >Register</Button>
  </Box>)
}

export default SignInBox;