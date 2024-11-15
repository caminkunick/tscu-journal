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

const TabCopyediting = ({ data, submit, reload, ...props }) => {
  const [ files, setFiles ] = React.useState({
    fetched: false,
    files: {},
  })
  const [ discuss, setDiscuss ] = React.useState({
    fetched: false,
    docs: [],
    users: {},
  })

  const handleAddFile = async (file) => {
    const result = await data.addAttachment('copyedited', ({ ...file, user:submit.user }));
    setFiles(f=>({ ...f, ...result }));
  }
  const handleAddDiscuss = async discussData => {
    const result = await data.addDiscuss('copyediting', discussData);
    setDiscuss(f=>({ ...f, ...result }));
  }
  const handleAddMessage = did => async messageData => {
    const result = await data.addMessage(did, 'copyediting', messageData);
    setDiscuss(f=>({ ...f, ...result }));
  }
  const handleSetStep = stepData => async () => {
    await data.setStep(stepData);
    await reload();
  }

  React.useEffect(()=>{
    data.getAttachment('copyedited').then(result=>setFiles(f=>({ ...f, ...result, fetched:true })));
    data.getDiscuss('copyediting').then(result=>setDiscuss(f=>({ ...f, ...result, fetched:true })));
  }, [ data ])

  return (<React.Fragment>
    <Discussion
      label="Copyediting Discussions"
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
      {...discuss}
    />
    <Box mt={5} />
    <Attachments
      label="Copyedited"
      onAdd={handleAddFile}
      {...files}
    />
    <Actions mt={5}>
      { (submit.step===2 && submit.status==="submitting") && (<React.Fragment>
        <Button variant="outlined" onClick={handleSetStep({step:1})}
          startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
        >Back</Button>
        <Button variant="outlined" color="primary" onClick={handleSetStep({step:3})}
          startIcon={<FontAwesomeIcon icon={faChevronRight} />}
        >Next</Button>
      </React.Fragment>) }
    </Actions>
  </React.Fragment>)
}
TabCopyediting.propTypes = {
  data: propTypes.object.isRequired,
  reload: propTypes.func.isRequired,
  submit: propTypes.object.isRequired,
}


export default TabCopyediting;