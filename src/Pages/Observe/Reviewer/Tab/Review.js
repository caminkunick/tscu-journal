import { useContext } from "react"
import { ObserveReviewerContext } from "../Context";
import { Header, Text } from '@piui/Review';
import { Box, TextField, Typography } from "@material-ui/core";
import { Attachments, ReviewForm } from "@piui";

export const TabReview = props => {
  const { getFiles, ...store } = useContext(ObserveReviewerContext);
  const [state] = store.state;

  const EnhanceReviewResult = props => {
    if(state.reviewer.comment){
      return (<>
        <Header>Review Form</Header>
        <ReviewForm comment={state.reviewer.comment} />
        <Box mb={3} />
        <Attachments
          label="Addition Files"
          fetched={true}
          files={getFiles('addition-files')}
        />
      </>)
    } else if(state.files.filter(file=>file.group==='review-upload').length>0){ 
      return (<Attachments
        label="Review Upload"
        fetched={true}
        files={getFiles('review-upload')}
      />)
    } else {
      return <Typography color="textSecondary">waiting for reviewer</Typography>
    }
  } 

  return state.fetched ? (<>
    { state.reviewer.accept && (<>
      <Header>Reviewer Response</Header>
      <Text paragraph>
        {
          state.reviewer.accept==="false"
            ? "I do not have any competing interests"
            : "I may have competing interests"
        }
      </Text>
      { state.reviewer.accept==="true" && (<TextField
        fullWidth
        variant="outlined"
        multiline
        value={state.reviewer.acceptSpecify}
        disabled
      />) }
      <Box mb={5} />
    </>) }
    <Attachments
      label="Review Files"
      fetched={true}
      files={getFiles('review')}
    />
    <Box mt={5} />
    <EnhanceReviewResult />
  </>) : null ;
}