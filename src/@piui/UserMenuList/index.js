import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEllipsisV, faSignInAlt, faSignOutAlt, faUser } from '@fortawesome/pro-solid-svg-icons';
import { auth } from 'Modules/firebase';
import SignInDialog from '../SignInDialog';
import { Link } from 'react-router-dom';



const UserMenuList = ({ user, jid, ...props }) => {
  const [displayName, setDisplayName] = useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSignOut = () => auth.signOut();

  useEffect(() => {
    if (user && user.displayName) {
      setDisplayName(user.displayName || user.email || user.uid);
    }
  }, [user])

  return (<React.Fragment>
    <List disablePadding>
      {
        user
          ? (<>
            <ListItem>
              <ListItemIcon>
                {
                  user.photoURL
                    ? <Avatar src={user.photoURL} />
                    : <Avatar>{displayName ? displayName[0].toUpperCase() : ""}</Avatar>
                }
              </ListItemIcon>
              <ListItemText
                primary={displayName.toUpperCase()}
                secondary={<React.Fragment>
                  {props.role && <React.Fragment>Role: {props.role}<br /></React.Fragment>}
                </React.Fragment>}
                primaryTypographyProps={{
                  noWrap: true,
                  style: {
                    fontWeight: 'bold',
                  },
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                  variant: 'caption',
                  color: 'textSecondary',
                }}
              />
              <ListItemSecondaryAction>
                <IconButton size="small" onClick={handleClick}>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Menu
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
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={Link} to={`/${jid}/setting/profile-edit/`}><FontAwesomeIcon icon={faEdit} />&nbsp;Profile Edit</MenuItem>
              <MenuItem component={Link} to={`/${jid}/select-role/`}><FontAwesomeIcon icon={faUser} />&nbsp;Change Role</MenuItem>
              <MenuItem onClick={() => {
                handleClose();
                handleSignOut();
              }}><FontAwesomeIcon icon={faSignOutAlt} />&nbsp;Sign Out</MenuItem>
            </Menu>
            {props.children}
          </>)
          : (<>
            <ListItem>
              <SignInDialog>
                <Button fullWidth variant="outlined"
                  startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
                >Sign In</Button>
              </SignInDialog>
            </ListItem>
            {props.children}
          </>)
      }
    </List>
  </React.Fragment>)
}
UserMenuList.propTypes = {
  jid: propTypes.string.isRequired,
}

export default connect(s => ({
  user: s.user.data,
}))(UserMenuList);