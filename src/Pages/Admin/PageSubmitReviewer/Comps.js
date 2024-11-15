import React from 'react';
import { Box, Divider as ODivider, Typography, withStyles } from '@material-ui/core';

export const Actions = withStyles(theme=>({
  root: {
    "&:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
}))(Box);

export const Header = withStyles(theme=>({
  body1: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
}))(props=><Typography variant="body1" {...props} />)

export const Text = withStyles(theme=>({
  body2: {
    marginBottom: theme.spacing(3),
  },
}))(props=><Typography variant="body2" {...props} />)

export const Divider = props => (<Box my={3} children={<ODivider />} />)