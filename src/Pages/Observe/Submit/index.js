import { AppBar, Box, Tab, Tabs, withStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Container, ContentHeader, MainContainer } from "@piui";
import { useContext } from "react";

import { ObserveSubmitContext, connectObserveSubmit } from './Context';
import { ContentSubmission } from "./Content/Submission";
import { ContentReview } from "./Content/Review";
import { ContentCopyEditing } from "./Content/Copyediting";
import { ContentProduction } from "./Content/Production";
import { Sidebar } from "./Sidebar";

const TabContainer = withStyles(theme=>({
  root: {
    boxShadow: 'none',
  },
}))(props => <AppBar position="static" color="default" {...props} />);

const TabPanel = withStyles(theme=>({
  root: {
    width: '25%',
    textDecoration: ({disabled}) => Boolean(disabled) ? 'line-through' : 'none',
  },
}))(Tab);

const PageObserveSubmit = props => {
  const { jid, sid, ...store } = useContext(ObserveSubmitContext);
  const [state,setState] = store.state;

  const tabDisabled = index => state.fetched && state.submit && typeof state.submit.step === "number" && index>state.submit.step;
  const handleSetStep = (e,n) => setState(s=>({ ...s, tab:n }));

  return (<MainContainer sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label={state.fetched ? (state.submit && state.submit.title && state.submit.title.tha) : <Skeleton width="50%" />}
        breadcrumbs={[
          {label:"Home",to:`/`},
          {label:"Observe"},
          {label:"Submit",to:`/${jid}/observe`},
        ]}
      />
      <TabContainer>
        <Tabs value={state.tab} onChange={handleSetStep}>
          <TabPanel label="Submission" disabled={tabDisabled(0)} />
          <TabPanel label="Review" disabled={tabDisabled(1)} />
          <TabPanel label="Copyediting" disabled={tabDisabled(2)} />
          <TabPanel label="Production" disabled={tabDisabled(3)} />
        </Tabs>
      </TabContainer>
      <Box my={5}>
        {(()=>{
          switch(state.tab){
            case 0:
              return <ContentSubmission />;
            case 1:
              return <ContentReview />;
            case 2:
              return <ContentCopyEditing />;
            case 3:
              return <ContentProduction />;
            default:
              return null;
          }
        })()}
      </Box>
    </Container>
  </MainContainer>)
}

export default connectObserveSubmit(PageObserveSubmit);