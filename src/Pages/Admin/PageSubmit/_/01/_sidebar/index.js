import React from 'react';
import {
  ListItemText,
} from '@material-ui/core';
import { ListItemLink, UserMenuList } from '@piui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';


const Sidebar = ({ selected, ...props }) => {
  const { jid, sid } = props.match.params;
  const link = `/${jid}/admin/s/${sid}/`
  
  return (<>
    <ListItemLink divider to={`/${jid}/admin/`}>
      <ListItemText primary={<>
        <FontAwesomeIcon icon={faChevronLeft} />&nbsp;Back
      </>} />
    </ListItemLink>
    <UserMenuList>
      <ListItemLink selected={!selected} to={link}>
        <ListItemText primary="Information" />
      </ListItemLink>
      <ListItemLink selected={selected==='timeline'} to={link+'timeline'}>
        <ListItemText primary="Timeline" />
      </ListItemLink>
      <ListItemLink selected={selected==='message'} to={link+'message'}>
        <ListItemText primary="Message" />
      </ListItemLink>
      <ListItemLink selected={selected==='reviewer'} to={link+'reviewer'}>
        <ListItemText primary="Reviewers" />
      </ListItemLink>
    </UserMenuList>
  </>)
}


export default Sidebar;