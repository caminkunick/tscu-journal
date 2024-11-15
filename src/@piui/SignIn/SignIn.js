import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSignInAlt, faUserPlus } from '@fortawesome/pro-solid-svg-icons';
import { db, auth } from 'Modules/firebase';
import FBAuthUi from './FBAuthUi'
import { Link as RLink } from 'react-router-dom';

const SignIn = props => {
  const [ showPass, setShowPass ] = React.useState(false);
  const [ data, setData ] = React.useState({
    email:"",
    pass:""
  });
  const inputRef = {
    email: React.useRef(),
    pass: React.useRef(),
  };
  const handleChange = key => ({target}) => setData(d=>({...d,[key]:target.value}));
  const [ err, setErr ] = React.useState("");
  const [ fetching, setFetching ] = React.useState(false);

  const tfProps = key => ({
    fullWidth: true,
    style: {marginBottom:'0.5rem'},
    value: data[key],
    onChange: handleChange(key),
    inputRef: inputRef[key],
    onKeyUp: ({ keyCode }) => (keyCode===13 ? handleSignIn() : false),
  });

  const handleSignIn = () => {
    setErr("")
    if(!Boolean(data.email)){
      return inputRef.email.current.focus()
    }
    else if(!data.email.includes("@") || !data.email.includes(".")){
      setErr("Invalid e-mail format")
      return inputRef.email.current.focus()
    }
    else if(!Boolean(data.pass)){
      return inputRef.pass.current.focus()
    }

    setFetching(true);
    auth.signInWithEmailAndPassword(data.email,data.pass)
      .then(user => {
        setFetching(false);
        db.collection('users').doc(user.uid)
          .update({ email:user.email });
      })
      .catch(err => {
        setErr(err.message);
        setFetching(false);
      })
  }

  return (<Box hidden={props.tab!=='signin'}>
    <TextField
      label="E-mail"
      type="email"
      {...tfProps('email')}
      disabled={fetching}
    />
    <div style={{width:'100%'}} />
    <TextField
      label="Password"
      type={showPass?'text':'password'}
      {...tfProps('pass')}
      disabled={fetching}
    />
    <FormControlLabel
      control={<Checkbox
        checked={showPass}
        color="primary"
        onChange={()=>setShowPass(!showPass)}
        disabled={fetching}
      />}
      label={(showPass?'Hide':'Show')+` password`}
      style={{marginBottom:'0.5rem'}}
    />
    <Box hidden={Boolean(err)===false} mb={2}>
      <Typography color="error">{err}</Typography>
    </Box>
    {
      fetching
        ? (<Button variant="contained" disabled fullWidth
          startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}
        >Please Wait</Button>)
        : (<>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
            onClick={handleSignIn}
          >Sign In</Button>
          <Box my={3} children={<Divider />} />
          <Button
            fullWidth
            size="large"
            variant="outlined"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faUserPlus} />}
            onClick={props.onChange}
          >Register</Button>
        </>)
    }
    <FBAuthUi />
    <Box textAlign="center" mt={2}>
      <Link component={RLink} to="/reset-password/" target="_blank">Forget password?</Link>
    </Box>
  </Box>)
}

export default SignIn;
