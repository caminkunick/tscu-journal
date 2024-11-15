import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { Attachments, Discussion } from '@piui';
import { Box, Button, withStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import SendApprovedPdfEmail from './SendApprovedPdfEmail';
import { sendMail } from 'Method/mailer';
import { AdminSubmitContext } from '../Context';

const Actions = withStyles(theme=>({
  root: {
    "&>:not(:last-child)": {
      marginRight: theme.spacing(1),
    }
  },
}))(Box)

const TabCopyediting = ({ data, onUpdate, ...props }) => {
  const [ fetching, setFetching ] = React.useState(false);
  const store = useContext(AdminSubmitContext);
  const { jid, sid } = store.match.params;

  const handleAddFile = async (file) => {
    const files = await data.addFile('copyedited',file);
    onUpdate({ files })
  }
  const handleAddDiscuss = async discussData => {
    const discuss = await data.addDiscuss('copyediting', discussData);
    onUpdate({ discuss })
  }
  const handleAddMessage = async (did, messageData) => {
    const discuss = await data.addMessage(did, 'copyediting', messageData);
    onUpdate({ discuss })
  }
  const handleSetStep = stepData => async () => {
    setFetching(true);
    const submit = await data.setSubmit(stepData);
    if(stepData.step && stepData.step===3){
      const result = await sendMail('14',jid,sid);
      if(result.data.error){
        alert(result.data.message);
      }
    }
    onUpdate({ submit },{ step:submit.step });
    setFetching(false);
  }


  const EnhanceActions = () => {
    if(fetching){
      return <Button startIcon={<FontAwesomeIcon icon={faSpinner} pulse />} variant="outlined" disabled>Please Wait</Button>
    }
    if(data.submit.step===2 && data.submit.status==="submitting"){
      return (<React.Fragment>
        <Button variant="outlined" onClick={handleSetStep({step:1})}
          startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
        >Back</Button>
        <Button variant="outlined" color="primary" onClick={handleSetStep({step:3})}
          startIcon={<FontAwesomeIcon icon={faChevronRight} />}
        >Next</Button>
      </React.Fragment>);
    }
    return null;
  }

  return (<React.Fragment>
    <Discussion
      label="Copyediting Discussions"
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
      docs={data.getDiscussByGroup('copyediting')}
      users={data.users}
    />
    <Box mt={5} />
    <Attachments
      label="Copyedited"
      onAdd={handleAddFile}
      files={data.getFilesByGroup('copyedited')}
    />
    <Box display="flex" mt={1}>
      <Box flexGrow={1} />
      <SendApprovedPdfEmail />
    </Box>
    <Actions mt={5}>
      <EnhanceActions />
    </Actions>
  </React.Fragment>)
}
TabCopyediting.propTypes = {
  data: propTypes.object.isRequired,
  onUpdate: propTypes.func.isRequired,
}


export default TabCopyediting;