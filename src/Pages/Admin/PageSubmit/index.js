import React from 'react';
import { MainContainer, BackLink, ContentHeader, Container, ListItemLink } from '@piui';
import { Skeleton } from '@material-ui/lab';
import { AdminSubmit } from './func';
import { AppBar, Box, ListItemText, Tab, Tabs } from '@material-ui/core';

import TabSubmission from './TabSubmission';
import TabReview from './TabReview';
import TabCopyediting from './TabCopyediting';
import TabProduction from './TabProduction';
import { connectAdminSubmit } from './Context';

const tabLabels = ["Submission","Review","Copyediting","Production"];

const PageSubmit = props => {
  const { jid, sid } = props.match.params;
  const [ data, setData ] = React.useState(null);
  const [ state, setState ] = React.useState({
    fetched: false,
    step: 0,
  })


  const handleChangeTab = (e,step) => setState(s=>({ ...s, step }));
  const handleUpdate = (result,newState) => {
    setData(d=>({ ...d, ...result }));
    if(newState){
      setState(s=>({ ...s, ...newState }));
    }
  }


  const Sidebar = props => (<React.Fragment>
    <BackLink to={`/${jid}/admin/s/`} />
    <ListItemLink to={`/${jid}/admin/s/${sid}/r/`} divider>
      <ListItemText primary="Reviewers" />
    </ListItemLink>
  </React.Fragment>)


  React.useEffect(()=>{
    const data = new AdminSubmit(jid,sid);
    data.init().then(()=>{
      setState(s=>({ ...s, fetched:true, step:data.submit.step }));
    });
    setData(data);
  }, [ jid, sid ])


  return (<MainContainer sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label={state.fetched ? data.submit.title.eng : <Skeleton width="30%" />}
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
              <Tabs value={state.step} onChange={handleChangeTab}>
                { tabLabels.map((label,index)=>(<Tab
                  label={ data.submit.step<index ? <strike>{ label }</strike> : label }
                  disabled={ data.submit.step<index }
                  key={label}
                />)) }
              </Tabs>
            </AppBar>
            <Box p={3}>
              { state.step===0 && <TabSubmission data={data} onUpdate={handleUpdate} /> }
              { state.step===1 && <TabReview data={data} onUpdate={handleUpdate} /> }
              { state.step===2 && <TabCopyediting data={data} onUpdate={handleUpdate} /> }
              { state.step===3 && <TabProduction data={data} onUpdate={handleUpdate} /> }
            </Box>
          </React.Fragment>)
          : <Skeleton width="30%" />
      }
    </Container>
  </MainContainer>);
}

export default connectAdminSubmit(PageSubmit);