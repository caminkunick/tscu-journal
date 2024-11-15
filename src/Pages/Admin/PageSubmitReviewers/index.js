import React from 'react';
import { MainContainer, Container, ContentHeader, ListItemLink, BackLink } from '@piui';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';
import { db, dbTimestamp } from 'Modules/firebase';
import { Skeleton } from '@material-ui/lab';
import DialogAddReviewer from './DialogAddReviewer';
import { getAuthorName } from 'Method';

const getReviewers = async (jid,sid) => {
  const query = await db.collection('journals').doc(jid).collection('reviewers').where('parent','==',sid).get();
  const docs = query.docs.map(doc=>({ ...doc.data(), id:doc.id }));

  const asyncDocs = docs.map(doc=>doc.user).filter((s,i,a)=>a.indexOf(s)===i)
    .map(async uid=>{
      const query = await db.collection('journals').doc(jid).collection('users').doc(uid).get();
      const { info } = query.data() || {};  
      return {[uid]:{
        displayName: info ? getAuthorName(info.tha) : uid,
        info,
      }};
    })
  const users = Object.assign({}, ...(await Promise.all(asyncDocs)));
  return { docs, users };
}
const getAllReviewer = async (jid) => {
  const query = await db.collection('journals').doc(jid).collection('users').where('editor','==',true).get();
  const asyncUsers = query.docs
    .map(doc=>({ ...doc.data(), id:doc.id }))
    .map(doc=>({ [doc.id]:{
      displayName: doc.info ? getAuthorName(doc.info.tha) : doc.id,
      info: doc.info,
    }}));
  const users = Object.assign({}, ...asyncUsers);
  return { users };
}
const addReviewer = async (jid,sid,uid) => {
  const path = db.collection('journals').doc(jid).collection('reviewers');
  await path.add({
    parent: sid,
    user: uid,
    status: 'pending',
    step: 0,
    date: dbTimestamp(),
  })
  return true;
}

const PageSubmitReviewer = props => {
  const { jid, sid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    docs: [],
    users: {},
  })

  const handleAddReviewer = async uid => {
    await addReviewer(jid,sid,uid);
    const result = await getReviewers(jid,sid);
    setState(s=>({ ...s, ...result }))
  }
  const handleLoadReviewer = async () => await getAllReviewer(jid);


  const Sidebar = props => (<React.Fragment>
    <BackLink to={`/${jid}/admin/s/${sid}/`} />
  </React.Fragment>)


  React.useEffect(()=>{
    getReviewers(jid,sid)
      .then(result => setState(s=>({ ...s, ...result, fetched:true })));
  }, [ jid, sid ])

  return (<MainContainer sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label="Reviewers"
        breadcrumbs={[
          { label:"Home", to:`/${jid}` },
          { label:"Administrator" },
          { label:"Submission", to:`/${jid}/admin/s` },
          { label:"Submit", to:`/${jid}/admin/s/${sid}` },
        ]}
        secondaryActions={<DialogAddReviewer parentState={[state,setState]} onLoad={handleLoadReviewer} onAdd={handleAddReviewer} />}
      />
      <List>
        <Divider />
        {
          state.fetched
            ? (
              state.docs.length
                ? state.docs.map(doc=> (state.users[doc.user] && state.users[doc.user].info) && (<ListItemLink divider key={doc.id} to={`/${jid}/admin/s/${sid}/r/${doc.id}`}>
                  <ListItemText
                    primary={state.users[doc.user] ? state.users[doc.user].displayName : doc.user}
                    secondary={`E-mail: ${state.users[doc.user].info.email}`}
                  />
                </ListItemLink>))
                : (<ListItem divider>
                  <ListItemText primary="no reviewer" primaryTypographyProps={{color:"textSecondary"}} />
                </ListItem>)
            )
            : (<ListItem divider>
              <ListItemText primary={<Skeleton width="30%" />} />
            </ListItem>)
        }
      </List>
    </Container>
  </MainContainer>)
}

export default PageSubmitReviewer;