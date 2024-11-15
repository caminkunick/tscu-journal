import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, MenuItem, ListItem, ListItemText, ListItemSecondaryAction, List, IconButton, Divider, DialogActions } from '@material-ui/core';
import AuthorInfo from '@piui/AuthorInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPencilAlt } from '@fortawesome/pro-solid-svg-icons';
import { db } from 'Modules/firebase';
import { getAuthorName } from 'Method';

const initState = {
  open: true,
  fetched: false,
  info: null,
};

const getUserInfo = async (jid,uid) => {
  const query = await db.collection('journals').doc(jid).collection('users').doc(uid).get();
  const { info } = query.data() || {};
  return info || null;
}

const ProfileEditor = React.forwardRef((props,ref) => {
  const { jid, user, onClose } = props;
  const [ state, setState ] = React.useState({ ...initState });

  const OpenButton = <MenuItem ref={ref}>
    <FontAwesomeIcon icon={faEdit} />
    &nbsp;
    Profile Editor
  </MenuItem>;


  const handleSave = async (data) => {
    console.log(data);
    return true;
  }


  React.useEffect(()=>{
    if( (user ? user.uid : false) && state.open ){
      getUserInfo(jid,user.uid).then(info=>setState(s=>({ ...s, info, fetched:true })));
    } else {
      setState(s=>({ ...initState }))
    }
  }, [ user, state.open, jid ]);
  
  return (<React.Fragment>
    <Dialog
      fullWidth
      maxWidth="sm"
      open={true}
    >
      <DialogTitle>My Information</DialogTitle>
      <DialogContent>
        {
          state.info
            ? (<List>
              <Divider />
              <ListItem divider>
                <ListItemText
                  primary={<>
                    {getAuthorName(state.info.tha)} ({state.info.tha.dept})<br />
                    {getAuthorName(state.info.eng)} ({state.info.eng.dept})
                  </>}
                  secondary={<>
                    E-mail: {state.info.email}<br />
                    Phone: {state.info.phone}
                  </>}
                />
                <ListItemSecondaryAction>
                    <AuthorInfo
                      data={state.info}
                      onConfirm={handleSave}
                      button={<IconButton title="Edit" size="small">
                        <FontAwesomeIcon icon={faPencilAlt} size="xs" />
                      </IconButton>}
                    />
                </ListItemSecondaryAction>
              </ListItem>
            </List>)
            : <AuthorInfo title="Edit Information" onConfirm={()=>false} button={<Button>Add Infomation</Button>} />
        }
      </DialogContent>
      <DialogActions>
        <Button>Close</Button>
      </DialogActions>
    </Dialog>
  </React.Fragment>);
})

export default ProfileEditor;