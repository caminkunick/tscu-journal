import React from 'react';
import propTypes from 'prop-types';
import { Attachments, Discussion, Title, } from '@piui';
import { Box, Button, withStyles, Typography, } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faUndo, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { TableHead, Table, Row, Cell } from '@piui/TabTable';
import { getAuthorName } from 'Method';
import { sendMail } from 'Method/mailer';

const Actions = withStyles(theme=>({
  root: {
    "&>:not(:last-child)": {
      marginRight: theme.spacing(1),
    }
  },
}))(Box)

const TabSubmission = ({ data, onUpdate, ...props }) => {
  const [ fetching, setFetching ] = React.useState(false);

  const handleAddFile = async file => {
    const files = await data.addFile('user0',file);
    onUpdate({ files });
  }
  const handleAddDiscuss = async discussData => {
    const discuss = await data.addDiscuss('pre-review', discussData);
    onUpdate({ discuss });
  }
  const handleAddMessage = did => async messageData => {
    const discuss = await data.addMessage(did, 'pre-review', messageData);
    onUpdate({ discuss });
  }
  const handleChangeStep = newStatus => async () => {
    setFetching(true);
    const submit = await data.setSubmit(newStatus);
    if(newStatus.status==='rejected'){
      const mailResult = await sendMail('03',data.jid,data.sid);
      if(mailResult.data.error){
        alert(mailResult.data.message);
      }
    } else if(newStatus.step===1){
      const mailResult = await sendMail('02',data.jid,data.sid);
      if(mailResult.data.error){
        alert(mailResult.data.message);
      }
    } 
    onUpdate({ submit },{ step:submit.step });
    setFetching(false);
  }

  const EnhanceActions = props => {
    if(fetching){
      return <Button startIcon={<FontAwesomeIcon icon={faSpinner} pulse />} variant="outlined" disabled>Please Wait</Button>
    }
    if(data.submit.status==="rejected"){
      return (<Button variant="outlined" onClick={handleChangeStep({status:'submitting'})}
        startIcon={<FontAwesomeIcon icon={faUndo} />}
      >Unreject</Button>)
    } else if(data.submit.step===0){
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

  return (<>
    <Title data={data} />
    <Box mt={5} />
    <TableHead>Author</TableHead>
    <Table
      head={<Row>
        <Cell width="100%">Name</Cell>
        <Cell align="center">E-mail</Cell>
        <Cell align="center">Phone</Cell>
      </Row>}
    >
    {
      (data.submit.authors && data.submit.authors.length)
        ? data.submit.authors.map( (author,index) => (<Row key={index}>
          <Cell width={`100%`}>
            [Thai] { getAuthorName(author.tha) } ({author.tha.dept})<br />
            [English] { getAuthorName(author.eng) } ({author.eng.dept})
          </Cell>
          <Cell><Typography variant="caption" noWrap>{author.email}</Typography></Cell>
          <Cell>
            <abbr title={'Phone: '+author.phone}>
              <Typography variant="caption" noWrap>{author.phone.slice(0,-4)}XXXX</Typography>
            </abbr>
          </Cell>
        </Row>))
        : (<Row>
          <Cell colSpan={10}>
            <Typography variant="caption" color="textSecondary">no author</Typography>
          </Cell>
        </Row>)
    }
    </Table>
    <Box mt={5} />
    <Attachments
      label="Submitted Files"
      files={data.getFilesByGroup('user0')}
      uploadLabel="Upload as sender"
      onAdd={handleAddFile}
      admin
    />
    <Box mt={5} />
    <Discussion
      label="Pre-review Discussion"
      docs={data.getDiscussByGroup('pre-review')}
      users={data.users}
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
    />
    <Actions mt={5}>
      <EnhanceActions />
    </Actions> 
  </>);
}
TabSubmission.propTypes = {
  data: propTypes.object.isRequired,
  onUpdate: propTypes.func.isRequired,
}

export default TabSubmission;