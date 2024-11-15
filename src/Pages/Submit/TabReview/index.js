import React from 'react';
import { Attachments, Discussion } from '@piui';
import { Box, Typography } from '@material-ui/core';
import { sendMail } from 'Method/mailer';

const TabReview = ({ data, onUpdate, ...props }) => {
  
  const handleAddDiscuss = async discussData => {
    const discuss = await data.addDiscuss('review', discussData);
    const mailResult = await sendMail('12',data.jid,data.sid,'submits');
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    onUpdate({ discuss });
  }
  const handleAddMessage = async (did, messageData) => {
    const discuss = await data.addMessage(did, 'review', messageData);
    const mailResult = await sendMail('12',data.jid,data.sid,'submits');
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    onUpdate({ discuss });
  }
  const handleAddFile = group => async (file) => {
    const files = await data.addFile(group, file);
    onUpdate({ files });
  }

  return data.submit.step>0
  ? (<React.Fragment>
    <Attachments
      label="Reviewer's Comments"
      files={data.getFilesByGroup('reviewer-attach')}
    />
    <Box mt={5} />
    <Attachments
      label="Revisions"
      files={data.getFilesByGroup('revisions')}
      onAdd={handleAddFile('revisions')}
    />
    <Box mt={5} />
    <Discussion
      label="Review Discussions"
      docs={data.getDiscussByGroup('review')}
      users={data.users}
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
    />
  </React.Fragment>)
  : (<Typography color="textSecondary">Stage not initiated.</Typography>)
}

export default TabReview;