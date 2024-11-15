import { Box, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React from 'react';
import {
  DialogDelete,
  UploadButton,
  fileTypes,
} from '@piui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faTrash } from '@fortawesome/pro-solid-svg-icons';

const TabAttachment = ({ parentData, ...props }) => {
  const [ data, setData ] = parentData;

  const handleAddFile = file => setData(d=>({ ...d, files:[ ...d.files, { ...file, group:"user0" } ] }));
  const handleRemoveFile = index => () => setData(d=>{
    let files = [ ...d.files ];
    files.splice(index,1);
    return { ...d, files };
  })

  return (<React.Fragment>
    <List>
      <Divider />
      {
        data.files.length
          ? data.files.map((file,index)=>(<ListItem key={index} divider>
            <ListItemText
              primary={file.name}
              secondary={fileTypes[file.type]}
            />
            <ListItemSecondaryAction>
              <DialogDelete onDelete={handleRemoveFile(index)}>
                <IconButton size="small">
                  <FontAwesomeIcon icon={faTrash} size="xs" />
                </IconButton>
              </DialogDelete>
            </ListItemSecondaryAction>
          </ListItem>))
          : (<ListItem divider>
            <ListItemText primary="no file" primaryTypographyProps={{color:'textSecondary'}} />
          </ListItem>)
      }
    </List>
    <Box textAlign="center" mt={3}>
      <UploadButton withType variant="outlined" onChange={handleAddFile}
        startIcon={<FontAwesomeIcon icon={faFolderOpen} />}
      >Browse</UploadButton>
    </Box>
  </React.Fragment>);
}

export default TabAttachment;