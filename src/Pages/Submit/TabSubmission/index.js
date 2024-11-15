import React from 'react';
import propTypes from 'prop-types';
import { Box, Typography as OTypography, withStyles } from '@material-ui/core';
import { Attachments, Discussion } from '@piui';
import 'moment/locale/th';
import { getAuthorName } from 'Method';
import { TableHead, Table, Row, Cell } from '@piui/TabTable';


import EnhanceTitleTable from './EnhanceTitleTable'
import { sendMail } from 'Method/mailer';


const Typography = withStyles(theme=>({
  body1: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1,2),
  },
}))(OTypography);

const TabSubmission = ({ data, onUpdate, ...props }) => {
  
  const handleAddFile = async file => {
    const files = await data.addFile('user0',file);
    onUpdate({ files });
  }
  const handleAddDiscuss = async discussData => {
    const discuss = await data.addDiscuss('pre-review',discussData);
    onUpdate({ discuss });
  }
  const handleAddMessage = async (did, messageData) => {
    const discuss = await data.addMessage(did, 'pre-review', messageData);
    const mailResult = await sendMail('12',data.jid,data.sid,'submits');
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    onUpdate({ discuss });
  }

  return (<React.Fragment>
    <EnhanceTitleTable data={data} onUpdate={onUpdate} />
    <Box mt={5} />
    <TableHead>Author</TableHead>
    <Table
      head={<Row>
        <Cell>Name</Cell>
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
      label="Submission Files"
      fetched={true}
      withType
      files={data.getFilesByGroup('user0')}
      onAdd={handleAddFile}
    />
    <Box mt={5} />
    <Discussion
      label="Pre-Review Discussions"
      fetched={true}
      docs={data.getDiscussByGroup('pre-review')}
      users={data.users}
      onDiscussAdd={handleAddDiscuss}
      onMessageAdd={handleAddMessage}
    />
  </React.Fragment>)
}
TabSubmission.prototype = {
  data: propTypes.object.isRequired,
  onUpdate: propTypes.func.isRequired,
}

export default TabSubmission;