import React from 'react';
import { MainContainer, Container, ContentHeader, BackLink } from '@piui';
import { Box, Button, List, ListItem, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Reviewer } from 'Method/reviewer';

import { TabBar } from './TabBar';
import TabRequest from './TabRequest';
import TabDownload from './TabReview';
import TabCompletion from './TabCompletion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';

const defaultData = new Reviewer();

const PageSubmitReviewer = props => {
  const { jid, sid, rid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    tab: 0,
    removing: false,
  })
  const [ data, setData ] = React.useState(null);


  const handleSetTab = (e,tab) => setState(s=>({ ...s, tab }));
  const handleUpdate = (newData,newState) => {
    if(newData){ setData(d=>({ ...d, ...newData })); }
    if(newState){ setState(s=>({ ...s, ...newState })); }
  }
  const handleRemoveInvitation = async () => {
    setState(s=>({ ...s, removing:true }));
    await data.removeInvitation();
    props.history.push(`/${jid}/admin/s/${sid}/r/`);
  }


  const Sidebar = props => (<React.Fragment>
    <BackLink to={`/${jid}/admin/s/${sid}/r/`} />
    { (data && (data.request && !data.request.schedule)) && (<List disablePadding>
      <ListItem divider>
        {
          state.removing
            ? <Button fullWidth variant="outlined" startIcon={<FontAwesomeIcon icon={faSpinner} pulse />} disabled>Remove Invitation</Button>
            : <Button fullWidth variant="outlined" color="secondary" onClick={handleRemoveInvitation}>Remove Invitation</Button>
        }
      </ListItem>
    </List>) }
  </React.Fragment>)



  React.useEffect(()=>{
    defaultData.init(jid,rid).then(()=>{
      setData(defaultData);
      setState(s=>({ ...s, fetched:true, tab:defaultData.request.step }))
    })
  }, [ jid, sid, rid, state.fetched ])


  return (<MainContainer sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label={ state.fetched ? data.submit.title.eng : <Skeleton width="30%" /> }
        breadcrumbs={[
          { label:"Home", to:`/${jid}` },
          { label:"Administrator" },
          { label:"Submission", to:`/${jid}/admin/s` },
          { label:"Submit", to:`/${jid}/admin/s/${sid}` },
          { label:"Reviewer", to:`/${jid}/admin/s/${sid}/${rid}` },
        ]}
      />
      <TabBar value={state.tab} onChange={handleSetTab} />
      <Box px={3} py={5}>
        {
          state.fetched
            ? (<React.Fragment>
              { state.tab===0 && <TabRequest data={data} onUpdate={handleUpdate} /> }
              { state.tab===1 && <TabDownload data={data} onUpdate={handleUpdate} /> }
              { state.tab===2 && <TabCompletion data={data} onUpdate={handleUpdate} /> }
            </React.Fragment>)
            : (<Typography variant="h4">
              <Skeleton width="30%" />
            </Typography>)
        }
      </Box>
    </Container>
  </MainContainer>)
}

export default PageSubmitReviewer;