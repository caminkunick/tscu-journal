import React from 'react';
import propTypes from 'prop-types';
import { UploadButton, fileTypes } from '@piui';
import { TableHead, Table, Row, Cell } from '@piui/TabTable';
import { IconButton, Link, Typography } from '@material-ui/core';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/pro-solid-svg-icons';



const Attachments = ({ label, files, onAdd, withType, ...props }) => {

  const getPreviewLink = file => {
    const link = (file.url || file.original || "").replace("//files","/files");
    return link;
  }
  const getSize = size => {
    const mb = 1024*1024;
    if(size<mb){
      return Math.ceil(size/1024)+' KB';
    } else {
      return (size/mb).toFixed(2)+' MB';
    }
  }

  return (<React.Fragment>
    <TableHead
      secondaryActions={ onAdd && <UploadButton
        size="small"
        color="primary"
        onChange={onAdd}
      >{ props.uploadLabel || 'Upload file' }</UploadButton> }
    >{ label }</TableHead>
    <Table
      head={<Row>
        <Cell width="75%">Name</Cell>
        { withType && <Cell align="center">Type</Cell> }
        <Cell align="center">Date</Cell>
        <Cell align="center">Size</Cell>
        <Cell />
      </Row>}
    >
    {
      Object.keys(files).length
        ? Object.keys(files)
        .map(id=>({ ...files[id], id }))
        .sort((a,b)=>{
          const getDate = (date) => date ? date.toMillis() : Date.now();
          return getDate(a.date) - getDate(b.date);
        })
        .map((file)=>(<Row key={file.id}>
          <Cell>
            <Link href={getPreviewLink(file)} target="_blank">{ file.name }</Link>
          </Cell>
          { withType && (<Cell noWrap>{fileTypes[file.type]}</Cell>) }
          <Cell noWrap>{ moment(file.date.toMillis()).format("L LT") }</Cell>
          <Cell align="center" noWrap>{ getSize(file.size) }</Cell>
          <Cell padding="checkbox">
            <IconButton size="small" component="a" href={file.url} target="_blank" color="primary">
              <FontAwesomeIcon size="xs" icon={faDownload} />
            </IconButton>
          </Cell>
        </Row>))
        : (<Row>
          <Cell colSpan={10}>
            <Typography variant="caption" color="textSecondary">no file</Typography>
          </Cell>
        </Row>)
    }
    </Table>
  </React.Fragment>)
}
Attachments.propTypes = {
  label: propTypes.node.isRequired,
  uploadLabel: propTypes.node,
  files: propTypes.object.isRequired,
  onAdd: propTypes.func,
  admin: propTypes.bool,
}

export default Attachments;