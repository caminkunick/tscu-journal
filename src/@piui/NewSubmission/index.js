import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Stepper, Step } from '@piui/Stepper';
import { db, dbTimestamp } from 'Modules/firebase';
import { sendMail } from 'Method/mailer';

import TabTitle from './TabTitle';
import TabAuthor from './TabAuthor';
import TabAttachment from './TabAttachment';
import TabConfirm from './TabConfirm';
import DialogConfirmError from './DialogConfirmError';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';

const defaultState = {
  open: false,
  step: 0,
  confirmError: false,
  fetching: false,
};
const defaultData = {
  title: {
    tha: "",
    eng: "",
    others: [],
  },
  authors: [],
  files: [],
  checked: [false, false, false, false, false, false],
}

const NewSubmission = ({ user, dispatch, ...props }) => {
  const { jid } = props.match.params;
  const [state, setState] = React.useState({ ...defaultState });
  const [data, setData] = React.useState({ ...defaultData });

  const handleOpen = open => () => {
    if (!state.fetching) {
      if (open) {
        setState(s => ({ ...s, open }));
      } else {
        localStorage.newSubmission = JSON.stringify(data);
        setState({ ...defaultState });
        setTimeout(() => {
          setData({ ...defaultData });
        }, 500);
      }
    }
  }
  const handleConfirmErrorOpen = open => () => setState(s => ({ ...s, confirmError: open }));
  const handleChangeStep = action => () => {
    switch (action) {
      case "next":
        return setState(s => ({ ...s, step: s.step + 1 }));
      case "back":
        return setState(s => ({ ...s, step: s.step - 1 }))
      default:
        return false;
    }
  }
  const nextChecking = () => {
    if (state.step === 0) {
      return Boolean(data.title.tha)
        && Boolean(data.title.eng)
        && !(data.title.others.filter(title => Boolean(title.value) === false).length > 0);
    } else if (state.step === 1) {
      return Boolean(data.authors.length);
    } else if (state.step === 2) {
      return Boolean(data.files.length);
    }
    return false;
  }
  const confirmDisabled = data.checked.filter(checked => checked).length < 5;
  const handleConfirm = async () => {
    if (data.checked[0] && data.checked[1]) {
      handleConfirmErrorOpen(true)();
    } else {
      setState(s => ({ ...s, fetching: true }));
      const { files, ...submitData } = data;
      const promsSubmit = await db.collection('journals').doc(jid).collection('submits').add({
        ...submitData,
        user: user.uid,
        date: dbTimestamp(),
        step: 0,
        status: 'submitting',
      })
      const promsFiles = files.map(async file => (db.collection('journals').doc(jid).collection('submits').doc(promsSubmit.id).collection('files').add({
        ...file,
        user: user.uid,
        date: dbTimestamp(),
        parent: 0,
        step: 0,
        visibility: 'visible',
      })))
      await Promise.all(promsFiles);
      const mailResult = await sendMail('01', jid, promsSubmit.id);
      if (mailResult.data.error) {
        dispatch({ type: 'ALERTS_PUSH', data: { label: mailResult.data.error, severity: 'error' } });
      }
      setState(s => ({ ...defaultState }));
      setData({ ...defaultData });
    }
  }
  const handleClear = () => {
    setData(d=>({ ...d, ...defaultData }));
    setState(s=>({ ...s, step:0 }));
    localStorage.removeItem('newSubmission');
  }

  useEffect(()=>{
    if(state.open && localStorage.newSubmission){
      try{
        const cacheData = JSON.parse(localStorage.newSubmission);
        setData(d=>({ ...d, ...cacheData }));
      }catch(err){
        console.log(err)
      }
    }
  }, [ state.open ])

  return (<>
    { props.children && React.cloneElement(props.children, {
      onClick: handleOpen(!state.open)
    })}
    <Dialog
      fullWidth
      maxWidth="sm"
      open={state.open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>Add submission</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={state.step}>
          <Step label="Title" />
          <Step label="Author" />
          <Step label="Attachment" />
          <Step label="Complete" />
        </Stepper>
        <Box my={3}>
          {state.step === 0 && <TabTitle parentData={[data, setData]} />}
          {state.step === 1 && <TabAuthor jid={jid} parentData={[data, setData]} />}
          {state.step === 2 && <TabAttachment parentData={[data, setData]} />}
          {state.step === 3 && <TabConfirm parentData={[data, setData]} fetching={state.fetching} />}
        </Box>
      </DialogContent>
      <DialogActions>
        { !state.fetching && (<Button color="secondary" onClick={handleClear}>Clear</Button>) }
        <Box flexGrow={1} />
        {
          state.fetching
            ? (<Button disabled
              startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}
            >Please wait</Button>)
            : (<React.Fragment>
              { state.step < 3 && <Button color="primary" onClick={handleChangeStep('next')} disabled={!nextChecking()}>Next</Button>}
              { state.step === 3 && <Button color="primary" onClick={handleConfirm} disabled={confirmDisabled}>Confirm</Button>}
              { state.step > 0 && <Button onClick={handleChangeStep('back')}>Back</Button>}
              <Button onClick={handleOpen(false)}>Close</Button>
            </React.Fragment>)
        }
      </DialogActions>
    </Dialog>
    <DialogConfirmError open={state.confirmError} onClose={handleConfirmErrorOpen(false)} />
  </>)
}
NewSubmission.propTypes = {
  children: propTypes.node.isRequired,
}

export default connect(s => ({
  user: s.user.data,
}))(NewSubmission);