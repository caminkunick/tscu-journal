import React from 'react';
import { Switch, Route as ORoute } from 'react-router-dom';
import { Loading } from '@piui';
import PageSummary from './PageSummary';
import PageTimeline from './PageTimeline';
import PageMessage from './PageMessage';
import PageReviewer from './PageReviewer';
import { db } from 'Modules/firebase';

const getSubmit = async (jid,sid) => {
  const query = await db.collection('journals').doc(jid).collection('submits').doc(sid).get();
  return query.data();
}

// ========== P A G E   P A P E R ==========
const PagePaper = props => {
  const { jid, sid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    submit: {},
  });
  
  const Route = Props => (<ORoute {...Props}
    component={ps => <Props.component {...ps} submit={state.submit} />}
  />)
  
  
  React.useEffect(()=>{
    getSubmit(jid,sid)
      .then(submit=>setState(s=>({ ...s, fetched:true, submit })))
  }, [ jid, sid ]);
  
  
  return state.fetched 
    ? (<Switch>
      <Route path={"/:jid/admin/s/:sid/reviewer/:uid?"} component={PageReviewer} />
      <Route path={"/:jid/admin/s/:sid/message/:uid?"} component={PageMessage} />
      <Route path={"/:jid/admin/s/:sid/timeline"} component={PageTimeline} />
      <Route path={"/:jid/admin/s/:sid/"} component={PageSummary} />
    </Switch>)
    : <Loading />
}

export default PagePaper;