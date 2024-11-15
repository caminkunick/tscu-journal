import React from 'react';
import propTypes from 'prop-types';
import { Attachments, Discussion } from '@piui';
import { Box, Button, withStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';

const Actions = withStyles(theme=>({
  root: {
    "&>:not(:last-child)": {
      marginRight: theme.spacing(1),
    }
  },
}))(Box)

const TabReview = ({ data, submit, reload, ...props }) => {
  const [ reviewerAttachments, setReviewerAttachments ] = React.useState({
    fetched: false,
    files: {},
  })
  const [ revisions, setRevisions ] = React.useState({
    fetched: false,
    files: {},
  })
  const [ discuss, setDiscuss ] = React.useState({
    fetched: false,
    docs: [],
    users: {},
  })

  const handleSetStep = stepData => async () => {
    await data.setStep(stepData);
    await reload();
  }
  const handleAddDiscuss = async (discussData) => {
    const result = await data.addDiscuss('review', discussData);
    setDiscuss(d=>({ ...d, ...result }));
  }
  const handleAddMessage = did => async messageData => {
    const result = await data.addMessage(did, 'review', messageData);
    setDiscuss(d=>({ ...d, ...result }));
  }

  const EnhanceActions = props => {
    if(submit.step===1){
      return (<React.Fragment>
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

  const handleAddFile = group => async (file) => {
    if(group==='reviewer-attach'){
      const result = await data.addAttachment(group, file);
      setReviewerAttachments(r=>({ ...r, ...result }));
    } else if(group==='revisions'){
      const result = await data.addAttachment(group, { ...file, })
      setRevisions(r=>({ ...r, ...result }));
    }
  }


  React.useEffect(()=>{
    data.getAttachment('reviewer-attach').then(result=>setReviewerAttachments(r=>({ ...r, ...result, fetched:true })))
    data.getAttachment('revisions').then(result=>setRevisions(r=>({ ...r, ...result, fetched:true })))
    data.getDiscuss('review').then(result=>setDiscuss(r=>({ ...r, ...result, fetched:true })))
  }, [ data ])


  return (<React.Fragment>
    <Attachments
      label="Reviewer's Comments"
      onAdd={handleAddFile('reviewer-attach')}
      {...reviewerAttachments}
    />
    <Box mt={5} />
    <Attachments
      label="Revisions"
      onAdd={handleAddFile('revisions')}
      {...revisions}
    />
    <Box mt={5} />
    <Discussion
      label="Review DiscussionsAdd"
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
      {...discuss}
    />
    <Actions mt={5}>
      <EnhanceActions />
    </Actions>
  </React.Fragment>)
}
TabReview.propTypes = {
  data: propTypes.object.isRequired,
  submit: propTypes.object.isRequired,
  reload: propTypes.func.isRequired,
}

export default TabReview;