import propTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { UploadFile } from 'Modules/Upload';

const fileTypes = {
  article: "บทความ (Article Text)",
  thref: "รายการอ้างอิงภาษาไทย (Thai Reference)",
  figure: "ภาพประกอบ (Figure)",
  diagram: "ตาราง, แผนภาพ (Table, Diagram)",
  font: "อักขระพิเศษ (Special Fonts)",
};

const UploadButton = connect()(({ dispatch, onChange, withType, ...props }) => {
  const rand = ( Math.random() * 1000 ).toFixed(0);
  const id = `input-file-${rand}`;
  const [ state, setState ] = React.useState({
    fetching: false,
    open: false,
    value: "",
  });
  const [ file, setFile ] = React.useState({
    data: null,
    progress: 0,
    name: "",
    type: 'article',
  })

  const handleOpen = open => () => !state.fetching && setState(s=>({ ...s, open }));
  const handleChange = ({ target }) => {
    const files = [ ...target.files ];
    if(files.length){
      handleOpen(true)();
      setFile(f=>({ ...f, data:files[0], name:files[0].name }));
    }
  }
  const handleTypeChange = ({ target }) => setFile(f=>({ ...f, type:target.value }));
  const handleNameChange = ({ target }) => setFile(f=>({ ...f, name:target.value }));
  const handleUpload = async () => {
    setState(s=>({ ...s, fetching:true }));
    const result = await UploadFile(file.data, progress => {
      setFile(f=>({ ...f, progress }));
    });
    const data = { ...result, name:file.name, type:file.type };
    onChange(data);
    setState(s=>({ ...s, fetching:false, open:false }));
  }
  
  return (<>
    <input id={id} type="file" value={state.value} onChange={handleChange} hidden />
    <label htmlFor={id}>
      <Button component="span" {...props} />
    </label>
    {
      (file.data && file.data.size<(64*1024*1024))
        ? (<Dialog
          fullWidth
          maxWidth="xs"
          open={state.open}
          onClose={handleOpen(false)}
        >
          <DialogTitle>Upload File</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="File Name"
              value={file.name}
              onChange={handleNameChange}
              disabled={state.fetching}
            />
            {
              withType && (<React.Fragment>
                <Box mt={3} />
                <FormControl fullWidth>
                  <InputLabel>File Type</InputLabel>
                  <Select value={file.type} onChange={handleTypeChange} disabled={state.fetching}>
                    {
                      Object.keys(fileTypes).map(id=>(<MenuItem key={id} value={id}>
                        { fileTypes[id] }
                      </MenuItem>))
                    }
                  </Select>
                </FormControl>
              </React.Fragment>)
            }
            { state.fetching && (<Box mt={3}>
              <Typography variant="caption" color="textSecondary">
                <FontAwesomeIcon icon={faSpinner} pulse />&nbsp;Uploading {Math.ceil(file.progress*0.75)}%
              </Typography>
            </Box>) }
            { props.secondaryActions && (<Box mt={3}>{ props.secondaryActions }</Box>) }
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleUpload} disabled={!file.name || state.fetching}>Upload</Button>
            <Button onClick={handleOpen(false)} disabled={state.fetching}>Cancel</Button>
          </DialogActions>  
        </Dialog>)
        : (<Dialog
          fullWidth
          maxWidth="xs"
          open={state.open}
          onClose={handleOpen(false)}
        >
          <DialogTitle>Upload File</DialogTitle>
          <DialogContent>
            <DialogContentText>File size must smaller than 64 MB</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOpen(false)}>Close</Button>
          </DialogActions>  
        </Dialog>)
    }
  </>);
})
UploadButton.propTypes = {
  onChange: propTypes.func.isRequired,
}

export {
  UploadButton,
  fileTypes,
};