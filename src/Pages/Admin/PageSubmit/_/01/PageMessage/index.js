import React from 'react';
import { MainContainer, Container, ContentHeader, ListItemLink } from '@piui';
import {
  Box,
  Button,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCommentDots, faUserPlus } from '@fortawesome/pro-solid-svg-icons';
import { db, dbTimestamp, auth } from 'Modules/firebase';
import { Messages, MessageBox } from '@piui';


const getUserMessage = async (jid,sid,uid,callback) => {
  const path = db.collection('journals').doc(jid);
  const user = (await path.collection('users').doc(uid).get()).data();
  return path.collection('submits').doc(sid).collection('messages').onSnapshot(snapshot=>{
    const messages = snapshot.docs.map(doc=>({ ...doc.data(), id:doc.id }));
    callback({ messages, user });
  });
}

const Sidebar = props => {
  const { jid, sid, uid } = props.match.params;
  
  return (<>
    <ListItemLink divider to={`/${jid}/admin/s/${sid}`}>
      <ListItemText primary={<><FontAwesomeIcon icon={faChevronLeft} />&nbsp;Back</>} />
    </ListItemLink>
    {/* U S E R S */}
    <ListItemLink to={`/${jid}/admin/s/${sid}/message`} selected={!uid}>
      <ListItemText primary="Sender" />
    </ListItemLink>
    <ListItem>
      <Button fullWidth variant="outlined"
        startIcon={<FontAwesomeIcon icon={faUserPlus} />}
      >Add Editor</Button>
    </ListItem>
  </>)
}

const PageMessage = ({ submit, ...props }) => {
  const { jid, sid, uid=submit.user } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    messages: [],
    user: {},
  })

  const handleSend = async ({ message, files, }) => {
    const aID = auth.currentUser.uid;
    const data = {
      message,
      files,
      type: 'receiver',
      user: uid,
      by: aID,
      timestamp: dbTimestamp(),
    }
    await db.collection('journals').doc(jid).collection('submits').doc(sid).collection('messages').add(data);
    return true;
  }

  React.useEffect(()=>{
    getUserMessage(jid,sid,uid, data => {
      setState(s=>({ ...s, fetched:true, ...data }));
    })
  }, [ jid, sid, uid ]);

  
  return (<MainContainer sidebar={<Sidebar {...props} />}>
    <Container maxWidth="md">
      <ContentHeader
        label={
          state.fetched
            ? ( (state.user&&state.user.info) ? state.user.info.eng.fname : uid )
            : <Skeleton width={240} />
        }
        breadcrumbs={[
          { label:"Home", to:`/` },
          { label:"Administrator" },
          { label:"Submission", to:`/${jid}/admin/` },
          { label:"Message" },
        ]}
      />
      <Box display="flex" justifyContent="flex-end" mb={1}>
      {
        (submit.status && !["rejected","cancel"].includes(submit.status))
          ? (<MessageBox onSend={handleSend}>
            <Button variant="outlined" size="small"
              startIcon={<FontAwesomeIcon icon={faCommentDots} />}
            >New Message</Button>
          </MessageBox>)
          : (<Button variant="outlined" size="small" disabled
            startIcon={<FontAwesomeIcon icon={faCommentDots} />}
          >New Message</Button>)
      }
      </Box>
      <Messages msgs={state.messages} variant="administrator" />
    </Container>
  </MainContainer>);
}

export default PageMessage;