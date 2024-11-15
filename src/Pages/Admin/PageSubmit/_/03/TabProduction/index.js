import React from 'react';
import propTypes from 'prop-types';
import { Attachments, Discussion } from '@piui';
import { Box } from '@material-ui/core';

const TabProduction = ({ data, reload, submit }) => {
  const [ discuss, setDiscuss ] = React.useState({
    fetched: false,
    docs: [],
    users: {},
  })
  const [ files, setFiles ] = React.useState({
    fetched: false,
    files: {},
  })

  const handleAddFile = async file => {
    const result = await data.addAttachment('production', file);
    setFiles(f=>({ ...f, ...result }));
  }
  const handleAddDiscuss = async discussData => {
    const result = await data.addDiscuss('production', discussData);
    setDiscuss(d=>({ ...d, ...result }));
  }
  const handleAddMessage = did => async messageData => {
    const result = await data.addMessage(did, 'production', messageData);
    setDiscuss(d=>({ ...d, ...result }));
  }


  React.useEffect(()=>{
    data.getDiscuss('production').then(result=>setDiscuss(d=>({ ...d, ...result, fetched:true })));
    data.getAttachment('production').then(result=>setFiles(f=>({ ...f, ...result, fetched:true })));
  }, [ data ])


  return (<React.Fragment>
    <Discussion
      label="Production Discussions"
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
      {...discuss}
    />
    <Box mt={5} />
    <Attachments
      label="Galleys"
      onAdd={handleAddFile}
      {...files}
    />
  </React.Fragment>)
}
TabProduction.propTypes = {
  data: propTypes.object.isRequired,
  submit: propTypes.object.isRequired,
  reload: propTypes.func.isRequired,
}

export default TabProduction;