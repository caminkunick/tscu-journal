import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faUserPlus, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { auth } from 'Modules/firebase';



const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const RegisterBox = ({ onTabChange, ...props }) => {
  const [ state, setState ] = React.useState({
    fetching: false,
  })
  const [ data, setData ] = React.useState({
    email: '',
    pass: '',
    cfpass: '',
  });
  const [ validate, setValidate ] = React.useState({
    email: { error:false, msg:"" },
    pass: { error:false, msg:"" },
    cfpass: { error:false, msg:"" },
    result: { error:false, msg:"" },
  });
  
  
  const handleChangeInput = key => ({ target }) => {
    let val = target.value;
    let current = { ...validate };
    switch(key){
      case "email":
        val = val.toLowerCase();
        if(!validateEmail(val)){
          current[key] = { error:true, msg:"invalid email" };
        } else {
          current[key] = { error:false, msg:"" };
        }
        break;
      case "pass":
        const len = String(val).length;
        if(len<8){
          current[key] = { error:true, msg:`password must more than 8 letter (left ${ len<8 ? 8-len : 0 })` };
        } else {
          current[key] = { error:false, msg:"" };
        }
        break;
      case "cfpass":
        if(String(val)!==data.pass){
          current[key] = { error:true, msg:"password not match" };
        } else {
          current[key] = { error:false, msg:"" };
        }
        break;
      default:
        break;
    }
    setValidate(current);
    
    setData(d=>({ ...d, [key]:val }));
  };
  const handleRegister = () => {
    setState(s=>({ ...s, fetching:true }))
    auth.createUserWithEmailAndPassword(data.email,data.pass)
      .then(result=>{
        console.log(result)
        setState(s=>({ ...s, fetching:false }))
        setValidate(v=>({ ...v, result:{error:false,msg:""} }))
      })
      .catch(error=>{
        setValidate(v=>({ ...v, result:{error:true,msg:error.message} }))
        setState(s=>({ ...s, fetching:false }))
      });
  }
  const getProps = (name) => ({
    fullWidth: true,
    variant: "outlined",
    value: data[name],
    onChange: handleChangeInput(name),
    name,
    error: validate[name].error,
    helperText: validate[name].msg,
    style: { marginBottom:16 },
    disabled: state.fetching,
    inputProps: {
      autoComplete: 'new-password'
    },
  })
  
  
  const isComplete = () => {
    const emailValid = data.email && validateEmail(data.email);
    return (emailValid && data.pass && data.cfpass) && (data.pass === data.cfpass);
  }
  
  
  return (<Box px={3} pt={3} pb={6} {...props}>
    <Button onClick={onTabChange('signin')}
      startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
    >Back</Button>
    <Box mt={2}>
      <TextField label="Email" {...getProps('email')} />
      <TextField label="Password" type="password" {...getProps('pass')} />
      <TextField label="Confirm password" type="password" {...getProps('cfpass')} />
      { validate.result.error && <Typography variant="caption" color="error" paragraph>
        {validate.result.msg}
      </Typography> }
      {
        isComplete() && state.fetching===false
          ? (<Button disableElevation fullWidth size="large" variant="contained" color="primary" onClick={handleRegister}
            startIcon={<FontAwesomeIcon icon={faUserPlus} />}
          >Register</Button>)
          : <Button disableElevation fullWidth size="large" variant="contained" color="primary" disabled
            startIcon={<FontAwesomeIcon icon={ state.fetching ? faSpinner : faUserPlus} pulse={state.fetching} />}
          >{ state.fetching ? 'Please wait' : 'Register' }</Button>
      }
    </Box>
  </Box>)
}

export default RegisterBox;