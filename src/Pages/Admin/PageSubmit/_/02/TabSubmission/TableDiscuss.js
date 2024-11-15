import React from 'react';
import { Discussion } from '@piui';
import { getSubmissionDiscussionById, addDiscussion, addMessage } from 'Method/submission';

const TableDiscuss = ({ parentState, ...props }) => {
  const [ state ] = parentState;
  const [ data, setData ] = React.useState({
    fetched: false,
    docs: [],
    users: {},
  })


  const handleDiscussAdd = async (data) => {
    const result = await addDiscussion(state.jid, state.sid, 0, data);
    setData(d=>({ ...d, ...result, fetched:true }));
  }
  const handleMessageAdd = did => async (data) => {
    const result = await addMessage(state.jid, state.sid, did, 0, data);
    setData(d=>({ ...d, ...result, fetched:true }));
  }


  React.useEffect(()=>{
    getSubmissionDiscussionById(state.jid, state.sid, 0)
      .then(data=>(setData(d=>({ ...d, ...data, fetched:true }))))
  }, [ state.jid, state.sid ]);

  return (<>
    <Discussion
      label="Pre-review Discussion"
      onDiscussAdd={handleDiscussAdd}
      onMessageAdd={handleMessageAdd}
      {...data}
    />
  </>);
}

export default TableDiscuss;