import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import propTypes from 'prop-types';

const DialogDelete = ({ title, label, onDelete, defaultOpen=false, children, button, ...props }) => {
  const [ open, setOpen ] = React.useState(false);
  const [ fetching, setFetching ] = React.useState(false);
  
  const handleOpen = newOpen => () => !fetching && setOpen(newOpen);
  const handleOnDelete = async () => {
    setFetching(true);
    const result = await onDelete();
    if(result){
      handleOpen(false)();
    }
    setFetching(false);
  }
  
  React.useEffect(()=>{
    setOpen(defaultOpen);
  }, [ defaultOpen ])
  
  return (<>
    { (children || button) && React.cloneElement((children || button), {
      onClick: handleOpen(true),
    }) }
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClick={handleOpen(false)}
    >
      <DialogTitle>{ title || 'Delete Confirmation' }</DialogTitle>
      <DialogContent>
        <DialogContentText>{ label || 'Do you want to delete?' }</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen(false)}>Cancel</Button>
        <Button color="secondary" onClick={handleOnDelete}>{ props.confirmLabel || 'Delete' }</Button>
      </DialogActions>
    </Dialog>
  </>)
}
DialogDelete.propTypes = {
  title: propTypes.node,
  label: propTypes.node,
  defaultOpen: propTypes.bool,
  onDelete: propTypes.func.isRequired,
}

export default DialogDelete;