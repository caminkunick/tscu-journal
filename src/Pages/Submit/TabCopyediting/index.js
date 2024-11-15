import React from 'react';
import { Attachments, Discussion } from '@piui';
import { Box, Typography } from '@material-ui/core';
import { sendMail } from 'Method/mailer';

const TabCopyediting = ({ data, onUpdate, ...props }) => {

  const handleAddFile = async file => {
    const files = await data.addFile('copyedited',file);
    const mailResult1 = await sendMail('10-1',data.jid,data.sid);
    if(mailResult1.data.error){
      alert(mailResult1.data.message)
    }
    const mailResult2 = await sendMail('10-2',data.jid,data.sid);
    if(mailResult2.data.error){
      alert(mailResult2.data.message)
    }
    onUpdate({ files });
  }
  const handleAddDiscuss = async (discussData) => {
    const discuss = await data.addDiscuss('copyediting',discussData);
    const mailResult = await sendMail('12',data.jid,data.sid,'submits');
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    onUpdate({ discuss });
  }
  const handleAddMessage = async (did, messageData) => {
    const discuss = await data.addMessage(did, 'copyediting', messageData);
    const mailResult = await sendMail('12',data.jid,data.sid,'submits');
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    onUpdate({ discuss });
  }

  return data.submit.step>1
  ? (<React.Fragment>
    <Discussion
      label="Copyediting Discussions"
      docs={data.getDiscussByGroup('copyediting')}
      users={data.users}
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
    />
    <Box mt={5} />
    <Attachments
      label="Copyedited"
      files={data.getFilesByGroup('copyedited')}
      onAdd={handleAddFile}
    />
  </React.Fragment>)
  : <Typography color="textSecondary">Stage not initiated.</Typography>
}

export default TabCopyediting;