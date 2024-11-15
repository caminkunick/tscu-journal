import React from 'react';
import { connect } from 'react-redux';
import { db } from 'Modules/firebase';
import { Loading } from '@piui';
import { Switch, Route } from 'react-router-dom';

import PageHome from './PageHome';
import PageSubmit from './PageSubmit';
import PageSubmitReviewers from './PageSubmitReviewers';
import PageSubmitReviewer from './PageSubmitReviewer';
import PageEditor from './PageEditor';
import PageArchive from './PageArchive';
import PageCalendar from './PageCalendar';
import PageRestrictArea from './PageRestrictArea';
import { PageMailLog } from './PageMailLog';


const getRole = jid => async (dispatch,getState) => {
  const user = getState().user.data;
  const query = await db.collection('journals').doc(jid).collection('users').doc(user.uid).get();
  return ( query.data() && query.data().role ) || 'user';
}

const PageAdmin = ({ user, dispatch, ...props }) => {
  const { jid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    role: 'user',
  })

  React.useEffect(()=>{
    if(user){
      dispatch(getRole(jid))
      .then(role=>setState(s=>({ ...s, role, fetched:true })));
    }else{
      setState(s=>({ ...s, role: 'user' , fetched:true }))
    }
    
  }, [ jid, user, dispatch ]);

  return state.fetched
  ? (
    state.role==='admin'
      ? (<Switch>
        <Route path="/:jid/admin/maillog" component={PageMailLog} />
        <Route path="/:jid/admin/Calendar" component={PageCalendar} />
        <Route path="/:jid/admin/archive" component={PageArchive} />
        <Route path="/:jid/admin/reviewer" component={PageEditor} />
        <Route path="/:jid/admin/s/:sid/r/:rid" component={PageSubmitReviewer} />
        <Route path="/:jid/admin/s/:sid/r" component={PageSubmitReviewers} />
        <Route path="/:jid/admin/s/:sid" component={PageSubmit} />
        <Route path="/:jid/admin" component={PageHome} />
      </Switch>)
      : <PageRestrictArea back={`/${jid}/s`} />
  )
    : <Loading /> ;
}

export default connect(s=>({
  user: s.user.data,
}))(PageAdmin);