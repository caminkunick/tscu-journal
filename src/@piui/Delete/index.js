import React from 'react';
import propTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';

const Delete = ({ data, onDelete, onClose, ...props }) => {
  const [ state, setState ] = React.useState({
    fetching: false,
  })
  
  const handleClose = () => !state.fetching && onClose();
  const handleDelete = async () => {
    setState(s=>({ ...s, fetching:true }));
    await onDelete();
    setState(s=>({ ...s, fetching:false }));
  }
  
  return data && (<Dialog
    fullWidth
    maxWidth="xs"
    open={true}
    onClose={handleClose}
  >
    <DialogTitle>{ data.title }</DialogTitle>
    <DialogContent>
      <DialogContentText>{ data.label }</DialogContentText>
    </DialogContent>
    <DialogActions>
      {
        state.fetching
          ? <Button disabled
            startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}
          >Please wait</Button>
          : (<React.Fragment>
            <Button color="secondary" onClick={handleDelete}>Delete</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </React.Fragment>)
      }
    </DialogActions>
  </Dialog>);
}
Delete.propTypes = {
  data: propTypes.shape({
    label: propTypes.node,
    title: propTypes.node,
  }),
  onDelete: propTypes.func.isRequired,
  onClose: propTypes.func.isRequired,
}

export default Delete;