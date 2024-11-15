import React from 'react';
import propTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField } from '@material-ui/core';
import { Editor, UploadButton, fileTypes } from '@piui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faSpinner, faTrash } from '@fortawesome/pro-solid-svg-icons';
import EditorDisplay from '@piui/EditorDisplay';

const defaultData = {
  subject: "",
  message: null,
  files: [],
};
const toolbar = { options: ['inline', 'textAlign', 'history']};

const DialogAdd = ({ onAdd, ...props }) => {
  const [ state, setState ] = React.useState({
    fetching: false,
    open: false,
  });
  const [ data, setData ] = React.useState({ ...defaultData });
  
  const handleOpen = open => () => !state.fetching ? setState(s=>({ ...s, open })) : null;
  const handleSubjectChange = ({ target }) => setData(d=>({ ...d, subject:target.value }));
  const handleMessageChange = message => setData(d=>({ ...d, message }));
  const handleAddFile = file => setData(d=>({ ...d, files:[...d.files,file] }));
  const handleRemoveFile = index => () => setData(d=>{
    let files = [...d.files];
    files.splice(index, 1);
    return { ...d, files };
  });
  const handleConfirm = async () => {
    setState(s=>({ ...s, fetching:true }));
    await onAdd(data);
    setData({ ...defaultData });
    setState(s=>({ ...s, fetching:false }));
    handleOpen(false)();
  }

  return (<React.Fragment>
    { props.children && React.cloneElement(props.children, {
      onClick: handleOpen(!state.open),
    }) }
    <Dialog
      fullWidth
      maxWidth="sm"
      open={state.open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>Add Discussion</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          label="Subject"
          value={data.subject}
          onChange={handleSubjectChange}
          disabled={state.fetching}
        />
        <Box mt={3}>
          {
            state.fetching
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
          state.fetching
            ? <Button disabled
              startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}
            >Please wait</Button>
            : (<React.Fragment>
              <UploadButton variant="outlined" size="small" onChange={handleAddFile}
                startIcon={<FontAwesomeIcon icon={faPaperclip} />}
              >Attach</UploadButton>
              <Box flexGrow={1} />
              <Button color="primary" onClick={handleConfirm} disabled={!Boolean(data.subject && data.message)}>Add</Button>
              <Button onClick={handleOpen(false)}>Cancel</Button>
            </React.Fragment>)
        }
      </DialogActions>
    </Dialog>
  </React.Fragment>)
}
DialogAdd.propTypes = {
  onAdd: propTypes.func.isRequired,
}

export default DialogAdd;