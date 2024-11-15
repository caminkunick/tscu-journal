import propTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React, { cloneElement, Fragment } from 'react';

export const ConfirmDialog = props => {
  const [open,setOpen] = React.useState(false);
  const handleOpen = o => () => setOpen(o);
  const handleConfirm = () => {
    props.onConfirm();
    setOpen(false);
  }
  return (<Fragment>
    { props.children && cloneElement(props.children, {
      onClick: handleOpen(true),
    }) }
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>{ props.title || "Confirm" }</DialogTitle>
      <DialogContent>
        <DialogContentText>
          { props.label }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleConfirm}>Confirm</Button>
        <Button onClick={handleOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  </Fragment>);
}
ConfirmDialog.propTypes = {
  title: propTypes.string,
  label: propTypes.node.isRequired,
  onConfirm: propTypes.func.isRequired,
}