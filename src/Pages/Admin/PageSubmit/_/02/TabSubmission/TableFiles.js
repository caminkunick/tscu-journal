import React from 'react';
import { Attachments } from '@piui';
import { getSubmissionFilesById, addSubmissionFile } from 'Method/submission';

const TableFiles = ({ parentState, ...props }) => {
  const [ state ] = parentState;
  const [ data, setData ] = React.useState({
    fetched: false,
    files: [],
  });


  const handleAddFile = async (file) => {
    const { jid, sid } = state;
    const data = { ...file, user:state.submit.user };
    const files = await addSubmissionFile(jid,sid,0,data);
    setData(s=>({ ...s, files }));
  }


  React.useEffect(()=>{
    getSubmissionFilesById( state.jid, state.sid, 0 )
      .then(files=>setData(d=>({ ...d, fetched:true, files })));
    return () => false;
  }, [ state.jid, state.sid ]);


  return <Attachments label="Submission Files" onAdd={handleAddFile} {...data} />
}

export default TableFiles;