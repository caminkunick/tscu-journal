import React from 'react';
import { Attachments, ReviewForm } from '@piui';
import { Header } from '../Comps';
import { Box, TextField, Typography } from '@material-ui/core';

const TabDownload = ({ data, onUpdate, ...props }) => {

  const handleAdd = async file => {
    const files = await data.addFile('review', file);
    onUpdate({ files })
  }

  const EnhanceReviewResult = props => {
    if(data.request.comment){
      return (<React.Fragment>
        <Header>Review Form</Header>
        <ReviewForm comment={data.request.comment} />
        <Box mb={3} />
        <Attachments
          label="Addition Files"
          fetched={true}
          files={data.getFilesByGroup('addition-files')}
        />
      </React.Fragment>)
    } else if(data.files.filter(file=>file.group==='review-upload').length>0){ 
      return (<Attachments
        label="Review Upload"
        fetched={true}
        files={data.getFilesByGroup('review-upload')}
      />)
    } else {
      return <Typography color="textSecondary">waiting for reviewer</Typography>
    }
  } 

  
  return (<React.Fragment>
    { data.request.accept && (<>
      <Header>Reviewer Response</Header>
      <Typography paragraph>
        {
          data.request.accept==="false"
            ? "I do not have any competing interests"
            : "I may have competing interests"
        }
      </Typography>
      { data.request.accept==="true" && (<TextField
        fullWidth
        variant="outlined"
        multiline
        value={data.request.acceptSpecify}
        disabled
      />) }
      <Box mb={5} />
    </>) }
    <Attachments
      label="Review Files"
      fetched={true}
      files={data.getFilesByGroup('review')}
      onAdd={handleAdd}
    />
    <Box mt={5} />
    <EnhanceReviewResult />
  </React.Fragment>)
}

export default TabDownload;