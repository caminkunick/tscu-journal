import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Box,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/pro-solid-svg-icons';


const PlusIcon = <FontAwesomeIcon icon={faPlus} />;
const CheckIcon = <FontAwesomeIcon icon={faCheck} />;


const AddEditor = ({ users, onAdd, ...props }) => {
  const [ open, setOpen ] = React.useState(false);
  const [search,setSearch] = useState("");
  
  
  const getResults = () => {
    let currentUsers = [ ...users ];
    if(search){
      currentUsers = currentUsers.filter(user=> JSON.stringify(user).toLowerCase().includes(search.toLowerCase()) );
    }
    return currentUsers;
  }
  const handleOpen = newOpen => () => setOpen(newOpen)
  const handleAdd = uid => () => onAdd(uid);
  const handleSearch = e => setSearch(e.target.value);
  
  
  return (<>
    <Button variant="outlined" onClick={handleOpen(true)}
      startIcon={<FontAwesomeIcon icon={faPlus} />}
    >Add Reviewer</Button>
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
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
        <Box mt={2} />
        { Boolean(search) && <Typography variant="caption">search result of <b>"{search}"</b></Typography> }
        <List>
          <Divider />
          { getResults().map(user=>(<ListItem divider dense button key={user.uid} title={`UID: ${user.uid}`}>
            <ListItemText
              primary={
                (
                  (user.tha && user.eng) && (<>
                    {`${user.tha.title==="อื่นๆ" ? user.tha.othertitle : user.tha.title}${user.tha.fname} ${user.tha.sname}`}
                    <br />
                    {`${user.eng.title==="Others" ? user.eng.othertitle : user.eng.title} ${user.eng.fname} ${user.eng.sname}`}
                  </>)
                ) ||
                user.email ||
                user.uid
              }
              secondary={user.email || ""}
            />
            <ListItemSecondaryAction>
              {
                user.editor
                  ? <Button variant="outlined" size="small" startIcon={CheckIcon} disabled>Added</Button>
                  : <Button variant="outlined" size="small" startIcon={PlusIcon} onClick={handleAdd(user.uid)}>Add</Button>
              }
            </ListItemSecondaryAction>
          </ListItem>)) }
          { (getResults().length<1) && (<ListItem divider>
            <ListItemText secondary="account not found" />
          </ListItem>) }
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  </>)
}
AddEditor.propTypes = {
  users: propTypes.array.isRequired,
  onAdd: propTypes.func.isRequired,
}

export default AddEditor;