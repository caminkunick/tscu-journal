import React from 'react';
import {
  Dialog,
  Slide,
} from '@material-ui/core';
import SignInBox from './SignInBox';
import RegisterBox from './RegisterBox';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const SignInDialog = ({ children, ...props }) => {
  const [ state, setState ] = React.useState({
    open: false,
    showpass: false,
    tab: 'signin',
  })
  
  
  const handleOpen = newOpen => () => setState(s=>({ ...s, open:newOpen }));
  const handleTabChange = tab => () => setState(s=>({ ...s, tab }));
  
  
  return (<>
    { children && React.cloneElement(children, {
      onClick: handleOpen(true),
    }) }
    <Dialog
      open={state.open}
      onClose={handleOpen(false)}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="xs"
    >
      <SignInBox onTabChange={handleTabChange} hidden={state.tab!=='signin'} />
      <RegisterBox onTabChange={handleTabChange} hidden={state.tab!=='regist'} />
    </Dialog>
  </>)
}

export default SignInDialog;