import React from 'react';
import { Attachments } from '@piui';
import { Box } from '@material-ui/core';
import { getSubmissionDiscussionById } from 'Method/submission';



const TableReviewerAttach = ({ parentState, ...props }) => {
  const [ state, setState ] = parentState;
  const [ data, setData ] = React.useState({
    fetched: false,
    files: [],
  })

  const handleAddFiles = async data => {
    console.log(data);
  }

  React.useEffect(()=>{
    getSubmissionDiscussionById(state.jid, state.sid, 1)
      .then(data=>setData(d=>({ ...d, ...data, fetched:true })));
  }, [ state.jid, state.sid ]);

  return (<React.Fragment>
    <Attachments
      label="Reviewer's Comments"
      onAdd={handleAddFiles}
      {...data}
    />
    <Box mt={5} />
    <Attachments
      label="Revisions"
      onAdd={handleAddFiles}
      {...data}
    />
  </React.Fragment>);
}

export default TableReviewerAttach;