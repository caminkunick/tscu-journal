import React from 'react';
import propTypes from 'prop-types';
import { ListItemText } from '@material-ui/core';
import { BackLink, UserMenuList, ListItemLink } from '@piui';


const Sidebar = ({ jid, selected, ...props }) => {
  return (<>
    <BackLink to={`/${jid}/select-role/`} />
    <UserMenuList jid={jid} role="Administrator">
      <ListItemLink to={`/${jid}/admin/`} selected={!selected}>
        <ListItemText primary="Submission" />
      </ListItemLink>
      <ListItemLink to={`/${jid}/admin/archive`} selected={selected==='archive'}>
        <ListItemText primary="Archive" />
      </ListItemLink>
      <ListItemLink to={`/${jid}/admin/calendar`} selected={selected==='calendar'}>
        <ListItemText primary="Calendar" />
      </ListItemLink>
      {/**
      <ListItem>
        <ListItemText primary="Journal Information" primaryTypographyProps={{color:'textSecondary'}} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Category" primaryTypographyProps={{color:'textSecondary'}} />
      </ListItem>
      */}
      <ListItemLink to={`/${jid}/admin/reviewer`} selected={selected==='editor'}>
        <ListItemText primary="Reviewer management" />
      </ListItemLink>
      {/* <ListItemLink to={`/${jid}/admin/maillog`} selected={selected==='maillog'}>
      <ListItemText primary="E-mail Log" />
      </ListItemLink> */}
    </UserMenuList>
  </>)
};
Sidebar.propTypes = {
  jid: propTypes.string.isRequired,
};


export default Sidebar;