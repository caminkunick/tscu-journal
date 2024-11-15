import React from 'react';
import propTypes from 'prop-types';
import { Attachments, Discussion } from '@piui';
import { Box, Button, withStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faChevronLeft, faChevronRight, faPaperPlane, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { sendMail } from 'Method/mailer';
import Send2ndReview from './Send2ndReview';

const Actions = withStyles(theme=>({
  root: {
    "&>:not(:last-child)": {
      marginRight: theme.spacing(1),
    }
  },
}))(Box)

const TabReview = ({ data, onUpdate, ...props }) => {
  const [ fetching, setFetching ] = React.useState(false);
  console.log(process.env)

  const handleAddFile = group => async (file) => {
    const files = await data.addFile(group, file);
    onUpdate({ files });
  }
  const handleSetStep = stepData => async () => {
    setFetching(true)
    const submit = await data.setSubmit(stepData);
    if(stepData.status==='rejected'){
      const mailResult = await sendMail('09',data.jid,data.sid);
      if(mailResult.data.error){
        alert(mailResult.data.message);
      }
    } 
    onUpdate({ submit },{ step:submit.step });
    setFetching(false);
  }
  const handleAddDiscuss = async (discussData) => {
    const discuss = await data.addDiscuss('review',discussData);
    onUpdate({ discuss });
  }
  const handleAddMessage = async (did, messageData) => {
    const discuss = await data.addMessage(did,'review',messageData);
    onUpdate({ discuss });
  }

  const handleSendEmail = async () => {
    await data.setReviewerCommentDate();
    const mailResult = await sendMail('08',data.jid,data.sid);
    if(mailResult.data.error){
      alert(mailResult.data.message);
    } else {
      alert('Send email success.')
    }
  }

  const EnhanceActions = props => {
    if(fetching){
      return <Button startIcon={<FontAwesomeIcon icon={faSpinner} pulse />} variant="outlined" disabled>Please Wait</Button>
    }
    if(data.submit.step===1){
      return (<React.Fragment>
        <Button variant="outlined" color="secondary" onClick={handleSetStep({status:'rejected',step:0})}
          startIcon={<FontAwesomeIcon icon={faBan} />}
        >Reject</Button>
        <Button variant="outlined" onClick={handleSetStep({step:0})}
          startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
        >Back</Button>
        <Button variant="outlined" color="primary" onClick={handleSetStep({step:2})}
          startIcon={<FontAwesomeIcon icon={faChevronRight} />}
        >Next</Button>
      </React.Fragment>)
    }
    return null;
  }

  return (<React.Fragment>
    <Attachments
      label="Reviewer's Comments"
      onAdd={handleAddFile('reviewer-attach')}
      files={data.getFilesByGroup('reviewer-attach')}
    />
    <Box textAlign="right" mt={1}>
      <Button startIcon={<FontAwesomeIcon icon={faPaperPlane} />} size="small" variant="outlined" color="primary" onClick={handleSendEmail}>Send E-mail</Button>
    </Box>
    <Box mt={5} />
    <Attachments
      label="Revisions"
      onAdd={handleAddFile('revisions')}
      files={data.getFilesByGroup('revisions')}
    />
    <Box mt={5} />
    <Discussion
      label="Review Discussions"
      docs={data.getDiscussByGroup('review')}
      users={data.users}
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
    />
    <Box textAlign="right" mt={1}>
      <Send2ndReview />
    </Box>
    <Actions mt={5}>
      <EnhanceActions />
    </Actions>
  </React.Fragment>)
}
TabReview.propTypes = {
  data: propTypes.object.isRequired,
  onUpdate: propTypes.func.isRequired,
}

export default TabReview;