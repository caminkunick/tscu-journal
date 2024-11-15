import React from 'react';
import { connect } from 'react-redux';
import {
  MainContainer,
  Container,
  ContentHeader,
  AuthorInfo,
} from '@piui';
import { auth, db } from 'Modules/firebase';
import Sidebar from '../Sidebar';
import {
  Button,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  List,
  Divider,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/pro-solid-svg-icons';
import { getAuthorName } from 'Method';


const getUserInfo = async (jid, uid) => {
  const query = await db.collection('journals').doc(jid).collection('users').doc(uid).get();
  const { info } = query.data() || {};
  return info || null;
}
const updateInfo = async (jid, uid, info) => {
  try {
    await db.collection('journals').doc(jid).collection('users').doc(uid).update({ info });
    await auth.currentUser.updateProfile({ displayName: `${info.tha.fname} ${info.tha.sname}` });
    await auth.currentUser.updateEmail(info.email);
    return true;
  } catch (err) {
    return err;
  }
}

const ProfileEditPage = ({ user, ...props }) => {
  const { jid } = props.match.params;
  const [state, setState] = React.useState({
    fetched: false,
    info: null,
  })


  const handleChangeAuthor = async (info) => {
    await updateInfo(jid, user.uid, info);
    setState(s => ({ ...s, info }))
    return true;
  }


  React.useEffect(() => {
    if (jid && user) {
      getUserInfo(jid, user.uid)
        .then(info => setState(s => ({ ...s, info, fetched: true })));
    } else {
      setState(s => ({ ...s, fetched: true, info: null }))
    }
  }, [jid, user]);

  return (<MainContainer signInOnly sidebar={<Sidebar jid={jid} selected="profileedit" />}>
    <Container maxWidth="md">
      <ContentHeader
        label="Profile Edit"
        breadcrumbs={[
          { label: "Home", to: `/${jid}/` },
        ]}
      />
      {
        state.fetched
          ? (
            state.info
              ? (<List>
                <Divider />
                <ListItem divider>
                  <ListItemText
                    primary={<>
                      {getAuthorName(state.info.tha)} ({state.info.tha.dept})<br />
                      {getAuthorName(state.info.eng)} ({state.info.eng.dept})
                  </>}
                    secondary={<>
                      E-mail: {state.info.email}<br />
                    Phone: {state.info.phone}
                    </>}
                  />
                  <ListItemSecondaryAction>
                    <AuthorInfo
                      title="Edit Information"
                      disabledCheckbox
                      data={state.info}
                      onConfirm={handleChangeAuthor}
                      button={<Button variant="outlined" size="small" startIcon={<FontAwesomeIcon icon={faPencilAlt} size="xs" />}>Edit</Button>}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>)
              : null
          )
          : <CircularProgress size={32} color="inherit" />
      }
    </Container>
  </MainContainer>)
}

export default connect(s => ({ user: s.user.data }))(ProfileEditPage);