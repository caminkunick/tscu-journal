import { Grid, TextField } from '@material-ui/core';
import { Header, Text } from '@piui/Review';
import { useContext, Fragment } from 'react';
import { ObserveReviewerContext } from '../Context';
import moment from 'moment';

export const TabInvitation = props => {
  const store = useContext(ObserveReviewerContext);
  const [state] = store.state;

  const getProps = key => ({
    type: "date",
    value: (() => {
      let date = Boolean(state.fetched && state.reviewer && state.reviewer.schedule && state.reviewer.schedule[key]) ? state.reviewer.schedule[key] : "" ;
      if(date && date.toMillis){
        date = moment(date.toMillis()).format("YYYY-MM-DD");
      }
      return date;
    })(),
    disabled: true,
  });

  return state.fetched ? (<>
    <Header>Request for Review</Header>
    <Text>You have been selected as a potential reviewer of the following submission. Below is an overview of the submission, as well as the timeline for this review. We hope that you are able to participate.</Text>

    <Header>Article Title</Header>
    <Text>
      [Thai] {state.submit.title.tha}<br />
      [English] {state.submit.title.eng}
      {
        state.submit.title.others.length && state.submit.title.others.map(({ lang, value }, index) => (<Fragment key={index}>
          <br />[{lang}] {value}
        </Fragment>))
      }
    </Text>

    <Header>Review Type</Header>
    <Text>Double-blind</Text>

    <Header>Review Schedule</Header>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          helperText="Editor's Request"
          {...getProps('editor')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          helperText="Review Due Date"
          {...getProps('review')}
        />
      </Grid>
    </Grid>
  </>) : null ;
}