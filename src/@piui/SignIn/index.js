import React from 'react'
import { connect } from 'react-redux'
import {
  Box,
  Container,
} from '@material-ui/core';
import './index.scss';
import SignOut from './SignOut';
import SignIn from './SignIn';
import RegisterBox from '../SignInDialog/RegisterBox';
import { withStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const MainBox = withStyles(theme=>({
  root: {
    backgroundColor: blue[300],
  },
}))(props => {
  return (<Box className="main" {...props} />)
});

const Login = props => {
  const { user } = props
  const [ tab, setTab ] = React.useState('signin')
  const handleChange = val => () => setTab(val)
  const handleChangeTab = val => () => setTab(val)
  
  return (<div className="login-page">
    <MainBox>
      <div className="box">
        <Container maxWidth="xs">
        {
          user
            ? <SignOut />
            : (<>
              <SignIn tab={tab} onChange={handleChange('register')} />
              { tab==='register' && <RegisterBox onTabChange={handleChangeTab} px={0} pt={0} pb={3} /> }
            </>)
        }
        </Container>
      </div>
    </MainBox>
  </div>)
}

export default connect(s=>({user:s.user.data}))(Login);