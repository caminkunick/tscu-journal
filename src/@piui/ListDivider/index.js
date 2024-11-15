import React from 'react';
import {
  Divider,
  ListItem,
  ListItemText,
  withStyles,
} from '@material-ui/core';

export default withStyles(theme=>({
  root:{
    
  },
}))(props=>(<ListItem py={3}>
  <ListItemText primary={<Divider />} />
</ListItem>))