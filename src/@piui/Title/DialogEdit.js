import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import React from 'react';

const defaultState = {
  fetching: false,
  value: "",
}

const DialogEdit = ({ data, ...props }) => {
  const [ state, setState ] = React.useState({ ...defaultState });
  
  const handleClose = () => !state.fetching && data.onClose();
  const handleChange = ({ target }) => setState(s=>({ ...s, value:target.value }));
  const handleConfirm = () => {
    setState(s=>({ ...s, fetching:true }));
    data.onEdit(state.value);
    data.onClose();
    setState({ ...defaultState });
  }

  return data && (<Dialog
    fullWidth
    maxWidth="xs"
    open={true}
    onClose={handleClose}
  >
    <DialogTitle>{ data.title }</DialogTitle>
    <DialogContent>
      <TextField
        fullWidth
        label="Title"
        defaultValue={data.value}
        onChange={handleChange}
        disabled={state.fetching}
      />
    </DialogContent>
    <DialogActions>
      {
        state.fetching
          ? <Button startIcon={<FontAwesomeIcon icon={faSpinner} pulse />} disabled>Please Wait</Button>
          : (<React.Fragment>
            <Button color="primary" onClick={handleConfirm} disabled={ !Boolean(state.value) || state.value===data.value  }>Save</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </React.Fragment>)
      }
    </DialogActions>
  </Dialog>)
}

export default DialogEdit;