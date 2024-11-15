import React from 'react';
import { Header, Text, Actions, } from '@piui/Review';
import { Box, Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@material-ui/core';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';

const ShowDate = ({ value, ...props }) => (<Grid item xs={12} md={4}>
  <TextField
    type="date"
    value={moment(value.toMillis()).format('YYYY-MM-DD')}
    disabled
    {...props}
  />
</Grid>)

const TabRequest = ({ reviewer, onChange, ...props }) => {
  const [fetching, setFetching] = React.useState(false);
  const [state, setState] = React.useState({
    accept: reviewer.request.accept || "false",
    acceptSpecify: reviewer.request.acceptSpecify || "",
  })


  const handleChange = ev => {
    const acceptSpecify = ev.target.value;
    setState(s => ({ ...s, acceptSpecify }));
  }
  const handleAccept = ({ target }) => setState(s => ({ ...s, accept: target.value }));
  const handleSave = async () => {
    setFetching(true);
    const request = await reviewer.saveRequest(state.accept, state.acceptSpecify);
    onChange({ request }, { tab: 1 });
    setFetching(false);
  }


  return (<React.Fragment>
    <Header>Request for Review</Header>
    <Text>You have been selected as a potential reviewer of the following submission. Below is an overview of the submission, as well as the timeline for this review. We hope that you are able to participate.</Text>

    <Header>Article Title</Header>
    <Text>
      [Thai] {reviewer.request.title.tha}<br />
      [English] {reviewer.request.title.eng}
      {reviewer.request.title.others.map(({ lang, value }, index) => (<React.Fragment key={index}>
        <br />[{lang}] {value}
      </React.Fragment>))}
    </Text>

    <Header>Review Type</Header>
    <Text>Double-blind</Text>

    <Header>Review Schedule</Header>
    <Grid container>
      <ShowDate
        value={reviewer.request.schedule.editor}
        helperText="Editor's Request"
      />
      <ShowDate
        value={reviewer.request.schedule.review}
        helperText="Review Due Date"
      />
    </Grid>
    <Box mt={5} mb={2}>
      <FormControl component="fieldset" disabled={Boolean(reviewer.request.accept) || fetching}>
        <RadioGroup value={state.accept} onChange={handleAccept}>
          <FormControlLabel value="false" control={<Radio color="primary" />} label="I do not have any competing interests" />
          <FormControlLabel value="true" control={<Radio color="primary" />} label="I may have competing interests (Specify below)" />
        </RadioGroup>
      </FormControl>
      {state.accept === "true" && (<TextField
        fullWidth
        variant="outlined"
        multiline
        rows={3}
        value={state.acceptSpecify}
        onChange={handleChange}
        disabled={Boolean(reviewer.request.accept) || fetching}
      />)}
    </Box>
    {
      !Boolean(reviewer.request.accept)
      && (<Actions mt={1}>
        {
          fetching
            ? <Button disabled variant="outlined" startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}>Please wait</Button>
            : <Button variant="outlined" color="primary" onClick={handleSave}>Save and Continue</Button>
        }
      </Actions>)
    }
  </React.Fragment>)
}

export default TabRequest;