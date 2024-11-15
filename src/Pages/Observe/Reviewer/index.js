import { AppBar, Box, Tab, Tabs, withStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Container, ContentHeader, MainContainer } from '@piui';
import { useContext } from 'react';
import { ObserveReviewerContext, connectObserveReviewer } from './Context';
import { TabInvitation } from './Tab/Invitation';
import { TabReview } from './Tab/Review';
import { TabCompletion } from './Tab/Completion';
import { Sidebar } from './Sidebar';

const TabContainer = withStyles(theme=>({
  root: {
    boxShadow: 'none',
  },
}))(props=><AppBar position="static" color="default" {...props} />);

const TabPanel = withStyles(theme=>({
  root: {
    width: 'calc(100% / 3)',
    maxWidth: 9999,
  },
}))(Tab)

const PageObserveReviewer = props => {
  const { jid, sid, ...store } = useContext(ObserveReviewerContext);
  const [state,setState] = store.state;

  const handleChangeTab = (e,tab) => setState(s=>({ ...s, tab }));

  return (<MainContainer signInOnly sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label={(state.fetched && state.submit && state.submit.title)
          ? state.submit.title.tha
          : <Skeleton width="50%" />}
        breadcrumbs={[
          {label:'Home',to:`/`},
          {label:'Submit',to:`/${jid}`},
        ]}
      />
      <TabContainer>
        <Tabs value={state.tab} onChange={handleChangeTab}>
          <TabPanel label="Invitation" />
          <TabPanel label="Review" />
          <TabPanel label="Completion" />
        </Tabs>
      </TabContainer>
      <Box py={5}>
        { state.fetched ? ( state.submit && (()=>{
          switch(state.tab){
            case 0:
              return <TabInvitation />;
            case 1:
              return <TabReview />;
            case 2:
              return <TabCompletion />;
            default:
              return null;
          }
        })() ) : <Skeleton width="50%" /> }
      </Box>
    </Container>
  </MainContainer>)
}

export default connectObserveReviewer(PageObserveReviewer);