import React from 'react';
import {
  ListItemIcon,
  MenuItem as MUIMenuItem,
  withStyles,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const MenuItem = React.forwardRef(({ classes, children, icon, ...props }, ref) => (
  <MUIMenuItem className={classes.root} ref={ref} {...props}>
    { icon && (<ListItemIcon className={classes.icon}>
      <FontAwesomeIcon icon={icon} />
    </ListItemIcon>) }
    { children }
  </MUIMenuItem>
))

export default withStyles(theme=>({
  root: {

  },
  icon: {
    minWidth: theme.spacing(4),
  },
}))(MenuItem);