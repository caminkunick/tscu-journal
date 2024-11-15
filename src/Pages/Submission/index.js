import React from 'react';
import { connect } from 'react-redux';
import { db } from 'Modules/firebase';
import Signin from '@piui/SignIn';

import Submission from './main';
import PageInfo from './PageInfo';

const SubmissionMain = ({ user, ...props }) => {
  const { jid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    isHasInfo: false,
  })

  const handleAddInfo = async () => {
    setState(s=>({ ...s, isHasInfo:true }))
  }

  React.useEffect(()=>{
    if(user && user.uid){
      db.collection('journals').doc(jid).collection('users').doc(user.uid).get().then(snap=>{
        const data = snap.data() || {};
        setState(s=>({ ...s, fetched:true, isHasInfo:Boolean(data.info) }));
      })
    } else {
      setState(s=>({ ...s, fetched:false, isHasInfo:false }));
    }
  }, [ jid, user ])

  if(user===null){
    return <Signin />
  } else {
    return state.fetched && (
      state.isHasInfo
        ? <Submission {...props} />
        : <PageInfo jid={jid} onAddInfo={handleAddInfo} />
    )
  }
}

export default connect(s=>({
  user: s.user.data,
}))(SubmissionMain);