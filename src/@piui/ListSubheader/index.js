import React from 'react';
import {
  Box,
  ListSubheader,
  withStyles,
} from '@material-ui/core';

export default withStyles(theme=>({
  root:{
    fontSize: theme.typography.body1.fontSize,
    display: 'flex',
    alignItems: 'center',
  },
}))(({ classes, children, secondaryActions, ...props })=>{
  return (<ListSubheader className={classes.root} {...props}>
    { children }
    { secondaryActions && (<>
      <Box flexGrow={1} />
      { secondaryActions }
    </>) }
  </ListSubheader>)
})