import React from 'react';
import { MainContainer, Container, ContentHeader, BackLink } from '@piui';
import { Skeleton } from '@material-ui/lab';
import { AppBar, Box, Tabs, Tab } from '@material-ui/core';

import TabSubmission from './TabSubmission';
import TabReview from './TabReview';
import TabCopyediting from './TabCopyediting';
import TabProduction from './TabProduction';

import { Sender } from './func';

const SubmitPage = ({ user, ...props }) => {
  const { jid, sid } = props.match.params;
  const [ data, setData ] = React.useState(null);
  const [ state, setState ] = React.useState({
    fetched: false,
    tab: 0,
  });
  const steps = ["Submission","Review","Copyediting","Production"];

  const handleChangeTab = (e,tab) => setState(s=>({ ...s, tab }));
  const handleUpdate = result => setData(d=>({ ...d, ...result }));


  const Sidebar = props => (<>
    <BackLink to={`/${jid}/s/`} />
  </>)


  React.useEffect(()=>{
    const data = new Sender(jid,sid);
    data.init().then(()=>{
      setState(s=>({ ...s, fetched:true, tab:data.submit.step }))
    });
    setData(data);
  }, [ jid, sid ]);


  return (<MainContainer signInOnly sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label={ state.fetched ? data.submit.title.eng : <Skeleton width={`30%`} /> }
        breadcrumbs={[
          { label:"Home", to:`/${jid}/` },
          { label:"My Submission", to:`/${jid}/s/` },
        ]}
      />
      <AppBar position="relative" color="default">
        <Tabs value={state.tab} onChange={handleChangeTab}>
          { steps.map((step,index)=>{
            const IsDisabled = (data ? data.submit : false) && data.submit.step<index;
            return <Tab
              label={ IsDisabled ? <strike>{ step }</strike> : step}
              disabled={IsDisabled}
              key={index}
            />
          }) }
        </Tabs>
      </AppBar>
      <Box px={2} py={3}>
      {
        state.fetched
          ? (<React.Fragment>
            { state.tab===0 && <TabSubmission data={data} onUpdate={handleUpdate} /> }
            { state.tab===1 && <TabReview data={data} onUpdate={handleUpdate} /> }
            { state.tab===2 && <TabCopyediting data={data} onUpdate={handleUpdate} /> }
            { state.tab===3 && <TabProduction data={data} onUpdate={handleUpdate} /> }
          </React.Fragment>)
          : <Skeleton width="30%" />
      }
      </Box>
    </Container>
  </MainContainer>)
}

export default SubmitPage;