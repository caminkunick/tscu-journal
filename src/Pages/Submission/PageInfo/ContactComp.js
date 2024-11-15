import React from 'react';
import {
  Box,
  TextField,
  withStyles,
} from '@material-ui/core';

const ContactComp = withStyles(theme=>({
  space: {
    "&:not(:last-child)": {
      marginBottom: theme.spacing(2),
    }
  }
}))( ({ classes, ...props }) => {
  const [ state, setState ] = React.useState({
    email: "",
    phone: "",
  })
  const [ helper, setHelper ] = React.useState({
    email: { error:false, text:"" },
    phone: { error:false, text:"" },
  })
  
  // ==================== C O M P O N E N T S ====================
  const handleChange = key => ({ target }) => setState(s=>{
    const newState = { ...s, [key]:target.value };
    
    switch(key){
      case "email":
        let email = { error:true, text:"E-mail invalid pattern" }
        if(emailTest()){
          email = { error:false, text:"" }
        }
        setHelper(h=>({ ...h, email }))
        break;
      case "phone":
        let phone = { error:true, text:"Phone number invalid" };
        if(phoneTest()){
          phone = { error:false, text:"" }
        }
        setHelper(h=>({ ...h, phone }))
        break;
      default:
        break;
    }
    return newState;
  })
  
  
  // ==================== C O M P O N E N T S ====================
  const getProps = key => ({
    className: classes.space,
    fullWidth: true,
    variant: "outlined",
    value: state[key],
    onChange: handleChange(key),
    error: helper[key].error,
    helperText: helper[key].text,
  });
  const ValidateEmail = email => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
    return regex.test(email) ? true : false;
  }
  const emailTest = () => ValidateEmail(state.email);
  const phoneTest = () => (state.phone+"").replace(/[^0-9]/gi,"").length > 8;
  const isComplete = () => emailTest() && phoneTest();
  
  
  return !Boolean(props.hidden) && (<>
    <TextField
      autoFocus
      label="E-mail"
      {...getProps('email')}
    />
    <TextField
      label="Phone"
      {...getProps('phone')}
    />
    <Box display="flex" justifyContent="flex-end">
      { props.Back }
      { isComplete() && props.Next({ ...state }) }
    </Box>
  </>)
})

export default ContactComp;