import React from 'react';
import { MainContainer, Container, ContentHeader } from '@piui';
import { Skeleton } from '@material-ui/lab';
import { getSubmissionById } from 'Method/submission';
import { AppBar, Box, Tab, Tabs } from '@material-ui/core';

import Sidebar from './Sidebar';

import TabSubmission from './TabSubmission';
import TabReview from './TabReview';

import AdminSubmission from 'Method/adminSubmission';

const PageSubmit = props => {
  const { jid, sid } = props.match.params;
  const [ state, setState ] = React.useState({
    jid,
    sid,
    fetched: false,
    submit: {},
    tab: 1,
  });
  const [ data, setData ] = React.useState(null);

  const handleChangeTab = (e,tab) => setState(s=>({ ...s, tab }));


  React.useEffect(()=>{
    if(data){
      data.get().then(snapshot=>console.log(snapshot))
    } else {
      setData(new AdminSubmission(jid,sid));
    }
  }, [ jid, sid, data ]);

  return (<MainContainer sidebar={<Sidebar {...props} />}>
    <Container maxWidth="md">
      <ContentHeader
        label={state.fetched ? state.submit.title.eng : <Skeleton width="30%" />}
        breadcrumbs={[
          { label:"Home", to:`/${jid}/` },
          { label:"Administrator" },
          { label:"Submission", to:`/${jid}/admin/` }
        ]}
      />
      <AppBar position="relative" color="default">
        <Tabs value={state.tab} onChange={handleChangeTab}>
          <Tab label="Submission" />
          <Tab label="Review" />
          <Tab label="Copyediting" />
          <Tab label="Production" />
        </Tabs>
      </AppBar>
      <Box p={3}>
        { state.tab===0 && <TabSubmission parentState={[state,setState]} /> }
        { state.tab===1 && <TabReview parentState={[state,setState]} /> }
      </Box>
    </Container>
  </MainContainer>);
}

export default PageSubmit;