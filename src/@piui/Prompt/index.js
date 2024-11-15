import React from 'react';
import propTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';

const Prompt = ({ title, label, button, defaultValue="", onConfirm, ...props }) => {
  const [ state, setState ] = React.useState({
    open: false,
    value: defaultValue+"",
    fetching: false,
  })
  const isDisabled = !Boolean(state.value) || defaultValue.trim()===state.value.trim();

  const handleOpen = open => () => !state.fetching && setState(s=>({ ...s, open }));
  const handleChange = ({ target }) => setState(s=>({ ...s, value:target.value }));
  const handleConfirm = async () => {
    setState(s=>({ ...s, fetching:true }));
    await onConfirm(state.value);
    setState(s=>({ ...s, open:false,fetching:false }));
  }
  
  return (<React.Fragment>
    { button && React.cloneElement(button, {
      onClick: handleOpen(!state.open)
    }) }
    <Dialog
      fullWidth
      maxWidth="xs"
      open={state.open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>{ title }</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={label}
          value={state.value}
          onChange={handleChange}
          disabled={state.fetching}
        />
      </DialogContent>
      <DialogActions>
        {
          state.fetching
            ? <Button disabled
              startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}
            >Please wait</Button>
            : (<React.Fragment>
              <Button color="primary" disabled={isDisabled} onClick={handleConfirm}>Confirm</Button>
              <Button>Close</Button>
            </React.Fragment>)
        }
      </DialogActions>
    </Dialog>
  </React.Fragment>)
};
Prompt.propTypes = {
  title: propTypes.node.isRequired,
  label: propTypes.node.isRequired,
  defaultValue: propTypes.string,
  button: propTypes.node.isRequired,
}

export default Prompt;