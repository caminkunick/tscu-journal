import React from 'react';
import { Box, Button, withStyles } from '@material-ui/core';
import 'moment/locale/th';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faSpinner, faUndo } from '@fortawesome/pro-solid-svg-icons';

import { onAccept, onReject, onUnreject } from './func';
import TableFiles from './TableFiles';
import TableDiscuss from './TableDiscuss';

const Actions = withStyles(theme=>({
  root: {
    marginTop: theme.spacing(5),
    "&>:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
}))(Box)

const TabSubmission = ({ parentState, ...props }) => {
  const [ state, setState ] = parentState;
  
  // ============================== METHOD ==============================
  const handleAccept = async () => {
    setState(s=>({ ...s, fetched:false }));
    const data = await onAccept(state.jid, state.sid);
    setState(s=>({ ...s, ...data, fetched:true, tab:1 }));
  }
  const handleReject = async () => {
    setState(s=>({ ...s, fetched:false }));
    const data = await onReject(state.jid, state.sid);
    setState(s=>({ ...s, ...data, fetched:true }));
  }
  const handleUnreject = async () => {
    setState(s=>({ ...s, fetched:false }));
    const data = await onUnreject(state.jid, state.sid);
    setState(s=>({ ...s, ...data, fetched:true }));
  }
  
  
  // ============================== ELEMENT ==============================
  const EnhanceActions = () => {
    let buttons = null;
    if(state.fetched){
      if(state.submit.status==='submitting' && state.submit.step===0){
        buttons = (<React.Fragment>
          <Button variant="outlined" color="primary" onClick={handleAccept}
            startIcon={<FontAwesomeIcon icon={faCheck} />}
          >Accept</Button>
          <Button variant="outlined" onClick={handleReject}
            startIcon={<FontAwesomeIcon icon={faBan} />}
          >Reject</Button>
        </React.Fragment>)
      } else if(state.submit.status==='rejected') {
        buttons = <Button variant="outlined" onClick={handleUnreject}
          startIcon={<FontAwesomeIcon icon={faUndo} />}
        >Unreject</Button>
      }
    } else {
      buttons = <Button variant="outlined" disabled
        startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}
      >Please wait</Button>
    }
    return buttons && (<Actions>{ buttons }</Actions>);
  }
  
  return (<React.Fragment>
    <TableFiles parentState={parentState} />
    <Box mt={5} />
    <TableDiscuss parentState={parentState} />
    <EnhanceActions />
  </React.Fragment>)
}

export default TabSubmission;