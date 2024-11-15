import React from 'react';
import { BackLink } from '@piui';

const Sidebar = props => {
  const { jid } = props.match.params;

  return (<>
    <BackLink to={`/${jid}/admin/s`} />
  </>);
}

export default Sidebar;