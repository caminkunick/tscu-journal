import React from 'react';
import propTypes from 'prop-types';
import { Button, Grid, TextField } from '@material-ui/core';
import { Actions, Header, Text } from '../Comps';
import moment from 'moment';
import 'moment/locale/th';
import { sendMail } from 'Method/mailer';

const TabRequest = ({ data, onUpdate, ...props }) => {
  const [schedule, setSchedule] = React.useState({
    editor: "",
    review: "",
  })
  const isComplete = Boolean(Object.values(schedule).filter(val => Boolean(val)).length);


  const getProps = key => ({
    type: "date",
    value: schedule[key],
    onChange: handleChangeDate(key),
    disabled: data.request && data.request.step !== 0,
  })
  const handleChangeDate = (key) => ({ target }) => {
    setSchedule(s => ({ ...s, [key]: target.value }));
    if (key === "editor" && !schedule.review) {
      const editor = new Date(target.value);
      const review = (new Date()).setTime(editor.getTime() + (15 * 24 * 60 * 60 * 1000));
      setSchedule(s => ({ ...s, review: moment(review).format("YYYY-MM-DD") }));
    }
  }
  const handleSendRequest = async () => {
    const request = await data.sendRequest(schedule);
    const mailResult = await sendMail('04', data.jid, data.rid);
    if(mailResult.error){
      alert(mailResult.message);
    }
    onUpdate({ request }, { tab: 1 });
  }


  React.useEffect(() => {
    if (data.request.step !== 0 && data.request.schedule) {
      const newSchedule = Object.assign({}, ...Object.keys(data.request.schedule).map(key => {
        const strDate = data.dateToStr(data.request.schedule[key]);
        return { [key]: strDate }
      }))
      setSchedule(s => ({ ...s, ...newSchedule }));
    }
  }, [data])


  return (<React.Fragment>
    <Header>Request for Review</Header>
    <Text>You have been selected as a potential reviewer of the following submission. Below is an overview of the submission, as well as the timeline for this review. We hope that you are able to participate.</Text>

    <Header>Article Title</Header>
    <Text>
      [Thai] {data.submit.title.tha}<br />
      [English] {data.submit.title.eng}
      {
        data.submit.title.others.length && data.submit.title.others.map(({ lang, value }, index) => (<React.Fragment key={index}>
          <br />[{lang}] {value}
        </React.Fragment>))
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
    <Actions mt={3}>
      {data.request.step === 0 && <Button variant="outlined" color="primary" disabled={!isComplete} onClick={handleSendRequest}>Send Invitaion</Button>}
    </Actions>
  </React.Fragment>)
}
TabRequest.propTypes = {
  data: propTypes.object.isRequired,
  onUpdate: propTypes.func.isRequired,
}

export default TabRequest;