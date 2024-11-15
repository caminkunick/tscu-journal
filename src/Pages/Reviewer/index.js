import React from 'react';
import { MainContainer, Container, ContentHeader, BackLink } from '@piui';
import { Skeleton } from '@material-ui/lab';
import ReviewObject from './func';
import { AppBar, Tabs, Tab, Box, Typography } from '@material-ui/core';

import TabRequest from './TabRequest';
import TabReview from './TabReview';
import TabCompletion from './TabCompletion';


const Reviewer = props => {
  const { jid, rid } = props.match.params;
  const [ reviewer, setReviewer ] = React.useState(null);
  const [ state, setState ] = React.useState({
    fetched: false,
    tab: 0,
  })


  const handleChangeTab = (e, tab) => setState(s=>({ ...s, tab }));
  const handleChange = (newReviewer,newState) => {
    setReviewer(r=>({ ...r, ...newReviewer }));
    if(newState){
      setState(s=>({ ...s, ...newState }));
    }
  }


  const Sidebar = props => (<React.Fragment>
    <BackLink to={`/${jid}/r/`} />
  </React.Fragment>)


  React.useEffect(()=>{
    const reviewer = new ReviewObject(jid,rid);
    setReviewer(reviewer);
    reviewer.init().then(data => {
      setState(s=>({ ...s, ...data, fetched:true }));
      if(reviewer.IsReviewerReviewed()){
        setState(s=>({ ...s, tab:2 }));
      }
    });
  }, [ jid, rid ])

  return (<MainContainer sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label={ state.fetched ? reviewer.request.title.eng : <Skeleton width="30%" /> }
        breadcrumbs={[
          { label:"Home", to:`/${jid}/` },
          { label:"My Submission", to:`/${jid}/s/` },
          { label:"Review Request", to:`/${jid}/r/` },
        ]}
      />
      <AppBar position="relative" color="default">
        <Tabs value={state.tab} onChange={handleChangeTab}>
          <Tab label="Request" />
          <Tab label="Review" />
          <Tab label="Completion" />
        </Tabs>
      </AppBar>
      <Box px={3} py={5}>
        {
          state.fetched
            ? (<React.Fragment>
              { state.tab===0 && <TabRequest reviewer={reviewer} onChange={handleChange} /> }
              { state.tab===1 && <TabReview reviewer={reviewer} onChange={handleChange} /> }
              { state.tab===2 && <TabCompletion reviewer={reviewer} onChange={handleChange} /> }
            </React.Fragment>)
            : (<Typography variant="body1"><Skeleton width="30%" /></Typography>)
        }
      </Box>
    </Container>
  </MainContainer>)
}

export default Reviewer;