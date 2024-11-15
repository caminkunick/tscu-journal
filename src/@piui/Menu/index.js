import React from 'react';
import propTypes from 'prop-types';
import {
  IconButton as MUIIconButton,
  Menu as MUIMenu,
  withStyles,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/pro-solid-svg-icons';


const IconButton = withStyles(theme=>({
  root: {
    minWidth: 48,
  },
}))(MUIIconButton);


const Menu = ({ button, ...props }) => {
  const [ anchorEl, setAnchorEl ] = React.useState(null);
  
  
  const handleOpen = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  
  return (<>
    {
      button
        ? React.cloneElement(button, { onClick:handleOpen })
        : (<IconButton edge="end" onClick={handleOpen}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </IconButton>)
    }
    <MUIMenu
      keepMounted
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      {...props}
    />
  </>)
}
Menu.propTypes = {
  children: propTypes.node.isRequired,
  button: propTypes.node,
};

export default Menu;