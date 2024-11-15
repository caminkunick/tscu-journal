import React from 'react';
import propTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Typography } from '@material-ui/core';
import { Table, Row, Cell, EditorDisplay, fileTypes } from '@piui';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/pro-solid-svg-icons';


const DialogMessageOpen = ({ docs, id, onAddClick, onClose, users, ...props }) => {
  const [ state, setState ] = React.useState({
    messages: [],
  });

  React.useEffect(()=>{
    if(id){
      const mapDocs = Object.assign({}, ...docs.map(doc=>({ [doc.id]:doc })));
      setState({ ...mapDocs[id] });
    }
  }, [ docs, id ]);

  return Boolean(id) && (<Dialog
    fullWidth
    maxWidth="sm"
    open={true}
    onClose={onClose}
  >
    <DialogTitle>{ state.subject }</DialogTitle>
    <DialogContent>
      <Table
        head={<Row>
          <Cell width="100%">Message</Cell>
          <Cell align="center">From</Cell>
        </Row>}
      >
        { state.messages
        .sort((a,b)=>{
          const getDate = date => date ? date.toMillis() : Date.now();
          return getDate(a.date) - getDate(b.date);
        })
        .map(msg=>(<Row key={msg.id} hover={false}>
          <Cell>
            <EditorDisplay content={msg.message} />
            { Boolean(msg.files.length) && (<div>
              { msg.files.map((file,index)=><div key={index}>
                <FontAwesomeIcon icon={faFile} />&nbsp;
                <Link href={file.original}>{ file.name } - { fileTypes[file.type] }</Link>
              </div>) }
            </div>) }
          </Cell>
          <Cell>
            <Typography noWrap variant="caption">
              { users[msg.user] }<br />
              { moment(msg.date.toMillis()).format('L LT') }
            </Typography>
          </Cell>
        </Row>)) }
      </Table>
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={onAddClick}>Add Message</Button>
      <Box flexGrow={1} />
      <Button onClick={onClose}>close</Button>
    </DialogActions>
  </Dialog>)
}
DialogMessageOpen.propTypes = {
  docs: propTypes.array.isRequired, 
  id: propTypes.any, 
  users: propTypes.object.isRequired,
  onClose: propTypes.func.isRequired,
  onAddClick: propTypes.func.isRequired,
}

export default DialogMessageOpen;