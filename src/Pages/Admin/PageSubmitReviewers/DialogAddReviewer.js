import React from 'react';
import propTypes from 'prop-types';
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, List, Divider, ListItem, ListItemText, ListItemSecondaryAction, TextField, Box, Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { Skeleton } from '@material-ui/lab';

const PlusIcon = () => <FontAwesomeIcon icon={faPlus} />;
const CheckIcon = () => <FontAwesomeIcon icon={faCheck} />;

const DialogAddReviewer = ({ parentState, onLoad, onAdd, ...props }) => {
  const [ pState ] = parentState;
  const [ state, setState ] = React.useState({
    fetched: false,
    open: false,
    users: {},
    fetching: false,
  });
  const [search,setSearch] = React.useState("");
  

  const handleOpen = open => () => !state.fetching && setState(s=>({ ...s, open }));
  const handleAddReviewer = uid => async () => {
    setState(s=>({ ...s, fetching:true }));
    await onAdd(uid);
    setState(s=>({ ...s, fetching:false, open:false }));
  }
  const handleSearch = e => setSearch(e.target.value);
  const getUsers = () => {
    let currentUsers = Object.keys(state.users).map(uid=>({ ...state.users[uid], uid }));
    if(search){
      currentUsers = currentUsers.filter(user=>{
        let info = (`${user.uid} ${user.displayName} ${user.info.email}`).toLocaleLowerCase();
        return info.includes(search.toLocaleLowerCase());
      });
    }
    return currentUsers;
  }


  const AddButton = ({ uid }) => {
    return state.fetching
      ? <Button variant="outlined" disabled><FontAwesomeIcon icon={faSpinner} pulse /></Button>
      : (
        pState.users[uid]
          ? <Button variant="outlined" size="small" disabled startIcon={<CheckIcon />}>Added</Button>
          : <Button variant="outlined" size="small" onClick={handleAddReviewer(uid)} startIcon={<PlusIcon />}>Add</Button>
      )
  }


  React.useEffect(()=>{
    onLoad().then(data=>setState(s=>({ ...s, ...data, fetched:true })));
  }, [ onLoad ])


  return (<>
    <Button variant="outlined" onClick={handleOpen(true)}
      startIcon={<FontAwesomeIcon icon={faPlus} />}
    >Add Reviewer</Button>
    <Dialog
      fullWidth
      maxWidth="sm"
      open={state.open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>Add Reviewer</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          label="Search"
          value={search}
          onChange={handleSearch}
        />
        <Box mb={2} />
        { Boolean(search) && (<Typography variant="caption">search result of <b>"{search}"</b></Typography>) }
        <List>
          <Divider />
          {
            state.fetched
              ? (
                getUsers().length
                  ? getUsers().map(user=>(<ListItem key={user.uid} button divider dense>
                    <ListItemText
                      primary={user.displayName}
                      secondary={ user.info ? `E-mail: ${user.info.email}` : null }
                    />
                    <ListItemSecondaryAction>
                      <AddButton uid={user.uid} />
                    </ListItemSecondaryAction>
                  </ListItem>))
                  : (<ListItem divider>
                    <ListItemText secondary="no reviewer" />
                  </ListItem>)
              )
              : (<ListItem divider>
                <ListItemText primary={<Skeleton width="50%" />} />
              </ListItem>)
          }
        </List>
      </DialogContent>
      <DialogActions>
        <Button disabled={state.fetching} onClick={handleOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  </>)
}
DialogAddReviewer.propTypes = {
  onLoad: propTypes.func.isRequired, 
  onAdd: propTypes.func.isRequired,
  parentState: propTypes.array.isRequired,
}

export default DialogAddReviewer;