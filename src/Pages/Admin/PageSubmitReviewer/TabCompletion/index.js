import React from 'react';
import { Discussion } from '@piui';

const TabCompletion = ({ data, onUpdate, ...props }) => {
  const handleAddDiscuss = async discussData => {
    const discuss = await data.addDiscuss('completion', discussData);
    onUpdate({ discuss });
  }
  const handleAddMessage = async (did, messageData) => {
    const discuss = await data.addMessage(did, 'completion', messageData);
    onUpdate({ discuss });
  }

  return (<React.Fragment>
    <Discussion
      label="Review Discussions"
      fetched={true}
      docs={data.getDiscussByGroup('completion')}
      users={data.users}
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
    />
  </React.Fragment>)
}

export default TabCompletion;