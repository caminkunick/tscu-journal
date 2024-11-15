import React from 'react';
import { Discussion } from '@piui';
import { Typography } from '@material-ui/core';
import { sendMail } from 'Method/mailer';

const TabCompletion = ({ reviewer, onChange, ...props }) => {
  const handleAddDiscuss = async data => {
    const result = await reviewer.addDiscuss('completion', data);
    const mailResult = await sendMail('12',reviewer.jid,reviewer.rid,'reviewers');
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    onChange(result);
  }
  const handleAddMessage = async(did, data) => {
    const result = await reviewer.addMessage(did, 'completion', data);
    const mailResult = await sendMail('12',reviewer.jid,reviewer.rid,'reviewers');
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    onChange(result);
  }

  return reviewer.IsReviewerReviewed()
  ? (<>
    <Discussion
      label="Review Discussions"
      fetched={true}
      docs={reviewer.getDiscussByGroup('completion')}
      users={reviewer.users}
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
    />
  </>)
  : (<Typography color="textSecondary">Stage not initiated.</Typography>)
}

export default TabCompletion;