import React from 'react';
import propTypes from 'prop-types';
import { Attachments, Discussion } from '@piui';
import { Box, Button, withStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faUndo } from '@fortawesome/pro-solid-svg-icons';

const Actions = withStyles(theme=>({
  root: {
    "&>:not(:last-child)": {
      marginRight: theme.spacing(1),
    }
  },
}))(Box)

const TabSubmission = ({ data, reload, submit, ...props }) => {
  const [ userFiles, setUserFiles ] = React.useState({
    fetched: false,
    files: {},
  })
  const [ discuss, setDiscuss ] = React.useState({
    fetched: false,
    docs: [],
    users: {},
  })


  const handleAddFile = group => async file => {
    const snapshot = await data.addAttachment(group, file);
    setUserFiles(f=>({ ...f, ...snapshot }));
  }
  const handleAddDiscuss = group => async discuss => {
    const result = await data.addDiscuss(group,discuss);
    setDiscuss(d=>({ ...d, ...result }));
  }
  const handleAddMessage = did => message => {
    console.log(did, message)
  }
  const handleChangeStep = stateData => async () => {
    await data.setStep(stateData);
    await reload();
  }


  const EnhanceActions = props => {
    if(submit.status==="rejected"){
      return (<Button variant="outlined" onClick={handleChangeStep({status:'submitting'})}
        startIcon={<FontAwesomeIcon icon={faUndo} />}
      >Unreject</Button>)
    } else if(submit.step===0){
      return (<React.Fragment>
        <Button variant="outlined" color="primary" onClick={handleChangeStep({step:1})}
          startIcon={<FontAwesomeIcon icon={faCheck} />}
        >Accept</Button>
        <Button variant="outlined" onClick={handleChangeStep({status:'rejected'})}
          startIcon={<FontAwesomeIcon icon={faBan} />}
        >Reject</Button>
      </React.Fragment>)
    }
    return null;
  }



  React.useEffect(()=>{
    data.getAttachment('user0').then( snapshot => setUserFiles(f=>({ ...f, ...snapshot, fetched:true })) );
    data.getDiscuss('pre-review').then( snapshot => setDiscuss(f=>({ ...f, ...snapshot, fetched:true })) );
  }, [ data ])

  return (<>
    <Attachments
      label="Submitted Files"
      onAdd={handleAddFile('user0')}
      {...userFiles}
    />
    <Box mt={5} />
    <Discussion
      label="Pre-review Discussion"
      onDiscussAdd={handleAddDiscuss('pre-review')}
      onMessageAdd={handleAddMessage}
      {...discuss}
    />
    <Actions mt={5}>
      <EnhanceActions />
    </Actions>
  </>);
}
TabSubmission.propTypes = {
  submit: propTypes.object.isRequired,
  data: propTypes.object.isRequired,
  reload: propTypes.func.isRequired,
}

export default TabSubmission;