import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import { Container, MainContainer } from '@piui';
import { auth, db } from 'Modules/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { Link } from 'react-router-dom';
import SignIn from '@piui/SignIn';

const getUserMatch = (jid, id, role, type) => async (dispatch, getState) => {
  const user = getState().user.data;
  if (user && jid && id && role) {
    const journal = db.collection('journals').doc(jid);
    const isAdmin = await (async () => {
      const res = (await journal.collection('users').doc(user.uid).get()).data();
      return Boolean(res && res.role && res.role === 'admin');
    })();
    if (role === 'o') {
      let outter;
      try {
        outter = (await journal.collection('submits').doc(id).get()).data();
      } catch (err) {
        outter = { user: null };
      }
      return {
        match: (outter ? outter.user === user.uid : false),
        exists: Boolean(outter),
        isAdmin
      };
    } else if (role === 'r') {
      let reviewer;
      try {
        reviewer = (await journal.collection('reviewers').doc(id).get()).data();
      } catch (err) {
        reviewer = { user: null };
      }
      return {
        match: (reviewer ? reviewer.user === user.uid : false),
        exists: Boolean(reviewer),
        isAdmin
      };
    } else if (role === 'a') {
      if (!isAdmin) {
        return { match: false, exists: false, parent: 0, isAdmin };
      }
      let q = null;
      if (type === "r") {
        q = (await journal.collection('reviewers').doc(id).get()).data();
      } else if (type === "o") {
        q = (await journal.collection('submits').doc(id).get()).data();
      }
      return {
        match: true,
        exists: Boolean(q),
        parent: (q && q.parent) || 0,
        isAdmin,
      };
    }
  }
  return { match: false, isAdmin: false };
}

const NotFoundPage = ({ jid, ...props }) => (<MainContainer>
  <Container maxWidth="sm">
    <Box textAlign="center">
      <Typography variant="h1" color="primary"><b>404</b></Typography>
      <Typography variant="h4" color="textSecondary">NOT FOUND</Typography>
      <Box mt={2} />
      <Button component={Link} to={`/${jid}/s`} variant="outlined" startIcon={<FontAwesomeIcon icon={faChevronLeft} />}>Back</Button>
    </Box>
  </Container>
</MainContainer>);

const defaultState = {
  fetched: false,
  exists: false,
  match: false,
  isAdmin: false,
};

const MailPage = ({ dispatch, user, ...props }) => {
  const { jid, id, role = 'o', type = 'o' } = props.match.params;
  const [state, setState] = React.useState({ ...defaultState })

  useEffect(() => {
    setState({ ...defaultState })
    if (jid && id && role && user) {
      dispatch(getUserMatch(jid, id, role, type))
        .then(result => {
          setState(s => ({ ...s, ...result, fetched: true }))
          setTimeout(() => {
            if (result.match) {
              if (role === 'o') {
                props.history.push(`/${jid}/s/id/${id}`);
              } else if (role === 'r') {
                props.history.push(`/${jid}/r/${id}`);
              } else if (role==='a'){
                if(type==='o'){
                  props.history.push(`/${jid}/admin/s/${id}`);
                } else if(type==='r'){
                  props.history.push(`/${jid}/admin/s/${result.parent}/r/${id}`);
                }
              }
            }
          }, 2000)
        });
    } else {
      setState(s => ({ ...s, fetched: true }));
    }
  }, [jid, id, role, user, type, dispatch, props.history]);

  if (!jid || !id)
    return <NotFoundPage jid={jid} />

  if (!user)
    return <SignIn />;

  if (!state.fetched)
    return (<Backdrop open={true} style={{ color: 'white' }}>
      <FontAwesomeIcon color="inherit" icon={faSpinner} pulse style={{ marginRight: 8 }} />
      <Typography color="inherit">User comparing...</Typography>
    </Backdrop>);

  if (!state.exists)
    return <NotFoundPage jid={jid} />;

  if (state.match)
    return (<Backdrop open={true} style={{ color: 'white' }}>
      <FontAwesomeIcon color="inherit" icon={faSpinner} pulse style={{ marginRight: 8 }} />
      <Typography color="inherit">Redirecting...</Typography>
    </Backdrop>);

  if (!state.match) {
    if (state.isAdmin) {
      return (<Dialog open={true}>
        <DialogTitle>Access as administrator</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Document not match your account.<br />
            Do you want to continue as administrator account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => auth.signOut()}>Sign out</Button>
          <Box flexGrow={1} />
          <Button component={Link} to={`/${jid}/${role === "o" ? "s" : "r"}/${role === "o"&&"id/"}${id}`} color="primary">Confirm</Button>
          <Button component={Link} to={`/${jid}/s`}>Cancel</Button>
        </DialogActions>
      </Dialog>)
    } else {
      return (<Dialog open={true}>
        <DialogTitle>Access denied</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your account cannot access this page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => auth.signOut()}>Sign out</Button>
          <Box flexGrow={1} />
          <Button component={Link} to={`/${jid}/s`}>Cancel</Button>
        </DialogActions>
      </Dialog>)
    }
  }

  return <NotFoundPage jid={jid} />;
}

export default connect(s => ({ user: s.user.data }))(MailPage);