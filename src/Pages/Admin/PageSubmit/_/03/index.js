import React from 'react';
import { MainContainer, Container, ContentHeader, BackLink, ListItemLink } from '@piui';
import { Skeleton } from '@material-ui/lab';

import AdminSubmission from 'Method/adminSubmission';
import { AppBar, Box, ListItemText, Tab, Tabs } from '@material-ui/core';

import TabSubmission from './TabSubmission';
import TabReview from './TabReview';
import TabCopyediting from './TabCopyediting';
import TabProduction from './TabProduction';


const tabLabels = ["Submission","Review","Copyediting","Production"];

const PageSubmit = props => {
  const { jid, sid } = props.match.params;
  const [ data, setData ] = React.useState(null);
  const [ state, setState ] = React.useState({
    fetched: false,
    submit: null,
    tab: 0,
  })

  const handleTabChange = (e, tab) => setState(s=>({ ...s, tab }));
  const handleReload = () => data.get().then(submit=>{
    setState(s=>({ ...s, submit, tab:submit.step, fetched:true }));
  });

  const Sidebar = props => (<React.Fragment>
    <BackLink to={`/${jid}/admin/s`} />
    <ListItemLink to={`/${jid}/admin/s/${sid}/r`}>
      <ListItemText primary="Reviewers" />
    </ListItemLink>
  </React.Fragment>)

  React.useEffect(()=>{
    if(data){
      data.get().then(submit=>{
        setState(s=>({ ...s, submit, tab:submit.step, fetched:true }));
      });
    } else {
      setData(new AdminSubmission(jid,sid));
    }
  }, [ jid, sid, data ]);

  return (<MainContainer sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label={state.fetched ? state.submit.title.eng : <Skeleton width="30%" />}
        breadcrumbs={[
          { label:"Home", to:`/${jid}/` },
          { label:"Administrator" },
          { label:"Submission", to:`/${jid}/admin/` }
        ]}
      />
      {
        state.fetched
          ? (<React.Fragment>
            <AppBar position="relative" color="default">
              <Tabs value={state.tab} onChange={handleTabChange}>
                { tabLabels.map((label,index)=><Tab
                  key={label}
                  label={ index>state.submit.step ? (<strike>{ label }</strike>) : label}
                  disabled={index>state.submit.step}
                />) }
              </Tabs>
            </AppBar>
            <Box px={3} py={5}>
              { state.tab===0 && <TabSubmission data={data} reload={handleReload} submit={state.submit} /> }
              { state.tab===1 && <TabReview data={data} reload={handleReload} submit={state.submit} /> }
              { state.tab===2 && <TabCopyediting data={data} reload={handleReload} submit={state.submit} /> }
              { state.tab===3 && <TabProduction data={data} reload={handleReload} submit={state.submit} /> }
            </Box>
          </React.Fragment>)
          : <Skeleton width="30%" />
      }
    </Container>
  </MainContainer>);
}

export default PageSubmit;