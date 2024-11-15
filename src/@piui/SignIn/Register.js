import React from 'react'
import {
  Box,
  Button,
  Divider,
  TextField,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faUserPlus } from '@fortawesome/pro-solid-svg-icons'

const Register = props => {
  const tfProps = { fullWidth:true, style:{marginBottom:'1rem'}, }
  return (<Box hidden={props.tab!=='register'}>
    <TextField
      fullWidth
      label="E-Mail"
      {...tfProps}
    />
    <TextField
      fullWidth
      label="Password"
      {...tfProps}
    />
    <TextField
      fullWidth
      label="Confirm Password"
      {...tfProps}
    />
    <Button
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      disableElevation
      startIcon={<FontAwesomeIcon icon={faUserPlus} />}
    >Register</Button>
    <Box my={3} children={<Divider />} />
    <Button
      fullWidth
      variant="outlined"
      color="primary"
      startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
      onClick={props.onChange}
    >Sign In</Button>
  </Box>)
}

export default Register