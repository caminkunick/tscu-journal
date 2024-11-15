import React from 'react';
import { connect } from 'react-redux';
import {
  Dialog,
  DialogContent,
  Slide,
} from '@material-ui/core';
import Container from './Container';
import { getUserInfo } from './func';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const PageInfo = ({ jid, dispatch, onAddInfo, ...props }) => {
  const [ state, setState ] = React.useState({
    fetched: false,
    exists: false,
  });
  
  const handleCompleted = async () => {
    const exists = await dispatch(getUserInfo(jid))
    setState(s=>({ ...s, exists }))
    onAddInfo()
  }
  
  React.useEffect(()=>{
    dispatch(getUserInfo(jid))
      .then( exists => setState(s=>({ ...s, exists, fetched:true })) )
    return ()=>(false);
  }, [ jid, dispatch ])
  
  return (state.fetched && !state.exists) && (<>
    <Dialog
      fullScreen
      TransitionComponent={Transition}
      open={true}
    >
      <DialogContent>
        <Container
          jid={jid}
          onCompleted={handleCompleted}
        />
      </DialogContent>
    </Dialog>
  </>)
}


export default connect()(PageInfo);