import PageObserveManage from './Manage';
import PageObserveSubmit from './Submit';
import PageObserveReviewer from './Reviewer';
import { useEffect, useState } from 'react';
import { Loading } from '@piui';
import { connect } from 'react-redux';
import { db } from 'Modules/firebase';
import SignIn from '@piui/SignIn';
import { ObserveRestrict } from './Restrict';
const { Switch, Route } = require("react-router-dom");

const getRole = async (jid, uid) => {
  const user = (await db.collection('journals').doc(jid).collection('users').doc(uid).get()).data();
  const { role } = user || {};
  return role==='observer';
}

export const PageObserve = connect(s => ({ user: s.user.data }))(({ user, ...props }) => {
  const { jid } = props.match.params;
  const [state, setState] = useState({
    fetched: false,
    isObserver: false,
  });

  useEffect(() => {
    if (user) {
      getRole(jid, user.uid)
        .then(isObserver => setState(s => ({ ...s, isObserver, fetched: true })));
    } else {
      setState(s => ({ ...s, isObserver: false, fetched: true }));
    }
  }, [jid, user])

  if (!user) return <SignIn />
  else if(!state.fetched) return <Loading />
  else if(!state.isObserver) {
    return <ObserveRestrict back={`/${jid}/`} />
  } else {
    return (<Switch>
      <Route path="/:jid/observe/s/:sid/r/:rid" component={PageObserveReviewer} />
      <Route path="/:jid/observe/s/:sid" component={PageObserveSubmit} />
      <Route path="/:jid/observe/" component={PageObserveManage} />
    </Switch>);
  }
})