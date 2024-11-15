import React from 'react';
import propTypes from 'prop-types';
import { Attachments, Discussion } from '@piui';
import { Box, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSpinner } from '@fortawesome/pro-solid-svg-icons';

const TabProduction = ({ data, onUpdate }) => {
  const [ fetching, setFetching ] = React.useState(false);

  const handleAddFile = async file => {
    const files = await data.addFile('production', file);
    onUpdate({ files });
  }
  const handleAddDiscuss = async discussData => {
    const discuss = await data.addDiscuss('production', discussData);
    onUpdate({ discuss });
  }
  const handleAddMessage = async(did, messageData) => {
    const discuss = await data.addMessage(did, 'production', messageData);
    onUpdate({ discuss });
  }
  const handleBack = async () => {
    setFetching(true);
    const submit = await data.setSubmit({ step:2 });
    onUpdate({ submit },{ step:2 });
    setFetching(false);
  }

  return (<React.Fragment>
    <Discussion
      label="Production Discussions"
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
      docs={data.getDiscussByGroup('production')}
      users={data.users}
    />
    <Box mt={5} />
    <Attachments
      label="Galleys"
      onAdd={handleAddFile}
      files={data.getFilesByGroup('production')}
    />
      { fetching && <Button startIcon={<FontAwesomeIcon icon={faSpinner} pulse />} variant="outlined" disabled>Please Wait</Button> }
      { (data.submit.step===3 && !fetching) && (<Box mt={5}><Button variant="outlined" onClick={handleBack}
        startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
      >Back</Button></Box>) }    
  </React.Fragment>)
}
TabProduction.propTypes = {
  data: propTypes.object.isRequired,
  onUpdate: propTypes.func.isRequired,
}

export default TabProduction;