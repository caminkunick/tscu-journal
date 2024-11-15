import React from 'react';
import {
  Box,
  Container,
  withStyles,
} from '@material-ui/core';

export default withStyles(theme=>({
  root: {
    padding: theme.spacing(0,3),
  },
  container: {
    padding: 0,
  },
}))(({ classes, ...props })=>(<Box className={classes.root}>
  <Container className={classes.container} {...props} />
</Box>))