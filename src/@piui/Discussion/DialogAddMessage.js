import React from 'react';
import propTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { Editor, UploadButton, fileTypes } from '@piui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faSpinner, faTrash } from '@fortawesome/pro-solid-svg-icons';
import EditorDisplay from '@piui/EditorDisplay';

const defaultData = {
  message: null,
  files: [],
};
const toolbar = { options: ['inline', 'textAlign', 'history']};

const DialogAddMessage = ({ onAdd, ...props }) => {
  const [ fetching, setFetching ] = React.useState(false);
  const [ data, setData ] = React.useState({ ...defaultData });
  
  const handleMessageChange = message => setData(d=>({ ...d, message }));
  const handleAddFile = file => setData(d=>({ ...d, files:[...d.files,file] }));
  const handleRemoveFile = index => () => setData(d=>{
    let files = [...d.files];
    files.splice(index, 1);
    return { ...d, files };
  });
  const handleConfirm = async () => {
    setFetching(true);
    await onAdd(data);
    setData({ ...defaultData });
    props.onClose();
    setFetching(false);
  }

  return (<React.Fragment>
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(props.open)}
      {...props}
    >
      <DialogTitle>Add Discussion</DialogTitle>
      <DialogContent>
        <Box mt={3}>
          {
            fetching
              ? data.message && <EditorDisplay content={data.message} />
              : <Editor toolbar={toolbar} defaultText={data.message} onChange={handleMessageChange} />
          }
        </Box>
        { Boolean(data.files.length) && (<Box mt={3}>
          <List>
            <Divider />
            { data.files.map((file,index)=>(<ListItem dense key={index} divider>
              <ListItemText
                primary={`${file.name} | ${fileTypes[file.type||'article']}`}
              />
              <ListItemSecondaryAction>
                <IconButton size="small" onClick={handleRemoveFile(index)}>
                  <FontAwesomeIcon size="xs" icon={faTrash} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>)) }
          </List>
        </Box>) }
      </DialogContent>
      <DialogActions>
        {
          fetching
            ? <Button disabled startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}>Please wait</Button>
            : (<React.Fragment>
              <UploadButton variant="outlined" size="small" onChange={handleAddFile}
                startIcon={<FontAwesomeIcon icon={faPaperclip} />}
              >Attach</UploadButton>
              <Box flexGrow={1} />
              <Button color="primary" onClick={handleConfirm} disabled={!Boolean(data.message)}>Add</Button>
              <Button onClick={props.onClose}>Cancel</Button>
            </React.Fragment>)
        }
      </DialogActions>
    </Dialog>
  </React.Fragment>)
}
DialogAddMessage.propTypes = {
  open: propTypes.any,
  onAdd: propTypes.func.isRequired,
  onClose: propTypes.func.isRequired,
}

export default DialogAddMessage;