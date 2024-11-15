import React from 'react';
import { UserMenuList, ListItemLink, BackLink } from '@piui';
import { ListItemText } from '@material-ui/core';

const Sidebar = ({ jid, ...props }) => {
  return (<>
    { Boolean(jid) && (<BackLink to={`/${jid}/`} />) }
    <UserMenuList jid={jid}>
      <ListItemLink selected={props.selected==='profileedit'} to={`/${jid}/setting/profile-edit`}>
        <ListItemText primary="Profile Edit" />
      </ListItemLink>
    </UserMenuList>
  </>)
}

export default Sidebar;