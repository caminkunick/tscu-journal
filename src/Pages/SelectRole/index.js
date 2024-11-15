import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import { db } from 'Modules/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faUserGraduate, faSpinner, faUserHeadset, faUserSecret } from '@fortawesome/pro-solid-svg-icons';
import { MainContainer  } from '@piui';


const UserIcon = () => <FontAwesomeIcon icon={faUserTie} />;
const ReviewerIcon = () => <FontAwesomeIcon icon={faUserGraduate} />;
const AdminIcon = () => <FontAwesomeIcon icon={faUserHeadset} />;
const ObserveIcon = () => <FontAwesomeIcon icon={faUserSecret} />;

const getUserData = async (jid,user) => {
  if(jid && user){
    const query = await db.collection('journals').doc(jid).collection('users').doc(user.uid).get();
    const userData = query.data() || {};
    return {
      admin: userData.role ? userData.role==='admin' : false,
      observer: userData.role ? userData.role==='observer' : false,
      reviewer: Boolean(userData.editor),
    };
  }
  return {};
}

const Container = withStyles(theme=>({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))(Box)

const ButtonLink = withStyles(theme=>({
  root: {
    width: '100%',
  },
}))(props=>(<Grid item xs={12}>
  <Button variant="outlined" color="primary" size="large" component={Link} {...props} />
</Grid>))

const SelectRole = ({ user, ...props }) => {
  const { jid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetch: false,
    admin: false,
    reviewer: false,
    observer: false,
  });

  const LinkUser = <ButtonLink to={`/${jid}/s/`} startIcon={<UserIcon />} key="user">Author</ButtonLink>;
  const LinkReviewer = <ButtonLink to={`/${jid}/r/`} startIcon={<ReviewerIcon />} key="reviewer">Reviewer</ButtonLink>
  const LinkObserver = <ButtonLink to={`/${jid}/observe/`} startIcon={<ObserveIcon />} key="observer">Observer</ButtonLink>
  const LinkAdmin = <ButtonLink to={`/${jid}/admin/`} startIcon={<AdminIcon />} key="admin">Administrator</ButtonLink>

  React.useEffect(()=>{
    getUserData(jid,user)
      .then(data=>setState(s=>({ ...s, fetched:true, ...data })));
  }, [ jid, user ])

  return (<MainContainer signInOnly><Container>
    <Box textAlign="center" style={{maxWidth:360,width:'100%'}}>
      <Typography variant="h4" paragraph style={{fontFamily:'Prompt'}}><b>Select Role</b></Typography>
      <Grid justify="center" container spacing={1}>
      {
        state.fetched
          ? (()=>{
            if(state.observer){
              return [LinkObserver]
            } else if(state.admin){
              return [LinkUser,LinkReviewer,LinkAdmin]
            } else {
              return [LinkUser,LinkReviewer]
            }
          })()
          : (<Button fullWidth variant="outlined" disabled startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}>Loading</Button>)
      }
      </Grid>
    </Box>
  </Container></MainContainer>)
}

export default connect(s=>({
  user: s.user.data,
}))(SelectRole);
