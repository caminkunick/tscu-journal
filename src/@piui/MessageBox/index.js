import React from 'react';
import propTypes from 'prop-types';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane, faTimes, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { UploadFile } from 'Modules/Upload';

const Btn = ({ label, icon, ...props }) => <Button
  variant="outlined"
  children={label}
  size="small"
  startIcon={<FontAwesomeIcon icon={icon} />}
  {...props}
/>;

const MessageBox = props => {
  const { onSend, children } = props;
  const [ fetching, setFetching ] = React.useState(false);
  const [ uploadProgress, setUploadProgress ] = React.useState({ name:'', progress:0 });
  const inputRef = {
    message: React.useRef(),
  };

  const [ open, setOpen ] = React.useState(false);
  const handleOpen = o => () => setOpen(o);

  const [ data, setData ] = React.useState({
    message: "",
    files: [],
  });
  const handleSetData = (key,value) => setData(d=>({ ...d, [key]:value }));
  const handleChangeFiles = ({ target }) => {
    let files = [ ...data.files, ...target.files ];
    const names = files.map(file=>(`${file.name+file.size}`));

    files = files
      .filter((f,i,fs)=>(names.indexOf(`${f.name+f.size}`) === i))
      .sort((a,b)=>(a.name.localeCompare(b.name)));

    handleSetData('files',files);
  };
  const handleRemoveFiles = index => () => setData(d=>{
    let files = [ ...d.files ];
    files.splice(index,1);
    return { ...d, files };
  })
  const handleSend = async () => {
    let params = { ...data };

    if(!params.message){
      inputRef.message.current.focus();
      return false;
    }

    if(getSizes()>64){
      alert('Total file size over limit (64 MB).');
      return false;
    }

    setFetching(true);

    if(params.files.length){
      const resultFiles = [];
      for(let i=0; i<params.files.length; i++){
        const file = params.files[i];
        const result = await UploadFile(file, progress => {
          setUploadProgress({ name:file.name, progress });
        })
        resultFiles.push(result)
      }
      params.files = resultFiles;
    }

    const result = await onSend(params);
    setFetching(false);
    if(result){
      setData({ message:"", files:[] });
      setOpen(false);
    }
  }
  const getSize = size => {
    let mbSize = size / (1024*1024);
    return  `${mbSize.toFixed(2)} MB`;
  }
  const getSizes = () => {
    let sizes = 0;
    data.files.forEach(file=>{
      sizes += file.size
    })
    return Math.ceil(sizes/(1024*1024));
  }

  const ToggleButton = React.cloneElement(children, {
    onClick: handleOpen(!open),
  });

  return (<>
    { ToggleButton }
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>Send Message</DialogTitle>
      <DialogContent>
        {
          fetching
            ? (<Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
              <CircularProgress color="inherit" />
              <Typography color="textSecondary">Please Wait</Typography>
              {
                uploadProgress.name
                  ? <Typography color="textSecondary">Upload "{uploadProgress.name}" ({uploadProgress.progress}%)</Typography>
                  : null
              }

            </Box>)
            : (<>
              <TextField
                autoFocus
                fullWidth
                multiline
                label="Message"
                variant="outlined"
                inputRef={inputRef.message}
                value={data.message}
                onChange={ ({ target }) => handleSetData('message',target.value) }
              />
              <Box hidden={!Boolean(data.files.length)}>
                <List dense>
                  <Divider />
                  {
                    data.files.length
                      ? data.files.map((file,index)=>(<ListItem button dense divider key={index}>
                        <ListItemText
                          primary={file.name+' | '+getSize(file.size)}
                          primaryTypographyProps={{
                            noWrap:true,
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small" color="secondary" onClick={handleRemoveFiles(index)}>
                            <FontAwesomeIcon size="xs" icon={faTrash} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>))
                      : null
                  }
                </List>
              </Box>
              { props.moreContent }
            </>)
        }
      </DialogContent>
      <DialogActions>
        {
          fetching
            ? (<Button variant="outlined" size="small" disabled>Cancel</Button>)
            : (<>
              {
                getSizes()<64
                  ? (<FormControl>
                    <input
                      id="input-file"
                      type="file"
                      multiple
                      style={{display:'none'}}
                      onChange={handleChangeFiles}
                    />
                    <label htmlFor="input-file">
                      <Btn component="span" label="Attach" icon={faPaperclip} />
                    </label>
                  </FormControl>)
                  : <Btn label="Attach" icon={faPaperclip} disabled />
              }
              <Typography variant="caption" color={ getSizes()<64 ? 'primary' : 'secondary'}>
                MAX {getSizes()}/64 MB
              </Typography>
              { props.moreActions }
              <Box flexGrow={1} />
              <Btn label="Send" icon={faPaperPlane} color="primary" onClick={handleSend} />
              <Btn label="Close" icon={faTimes} onClick={handleOpen(false)} />
            </>)
        }
      </DialogActions>
    </Dialog>
  </>);
};
MessageBox.propTypes = {
  children: propTypes.node.isRequired,
  onSend: propTypes.func.isRequired,
  moreActions: propTypes.node,
  moreContent: propTypes.node,
};

export default MessageBox;
