import React from 'react';
import propTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { Attachments, Discussion } from '@piui';
import { sendMail } from 'Method/mailer';

const TabProduction = ({ data, onUpdate, ...props }) => {


  const handleAddDiscuss = async (discussData) => {
    const discuss = await data.addDiscuss('production',discussData);
    const mailResult = await sendMail('12',data.jid,data.sid,'submits');
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    onUpdate({ discuss });
  }
  const handleAddMessage = async (did, messageData) => {
    const discuss = await data.addMessage(did, 'production', messageData);
    const mailResult = await sendMail('12',data.jid,data.sid,'submits');
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    onUpdate({ discuss });
  }

  return data.submit.step<3 ? (<Typography color="textSecondary">Stage not initiated.</Typography>) 
  : (<React.Fragment>
    <Discussion
      label="Production Discussions"
      docs={data.getDiscussByGroup('production')}
      users={data.users}
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
    />
    <Box mt={5} />
    <Attachments
      label="Galleys"
      files={data.getFilesByGroup('production')}
    />
  </React.Fragment>);
}
TabProduction.propTypes = {
  data: propTypes.object.isRequired,
  onUpdate: propTypes.func.isRequired,
}

export default TabProduction;