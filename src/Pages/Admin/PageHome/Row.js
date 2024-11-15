import React from 'react';
import { Link as RLink } from 'react-router-dom';
import {
  Checkbox,
  Link,
  TableRow,
  TableCell,
  Typography,
  withStyles,
} from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/th';

const labels = ["Submission","Review","Copyediting","Production"];

export const Cell = withStyles(theme=>({
  head: {
    backgroundColor: theme.palette.grey[200],
  },
  body: {
    '& .MuiTypography-root': {
      fontSize: 'inherit !important',
    },
  }
}))(TableCell);

export const Row = ({ doc, jid, ...props }) => {
  const data = doc.data();
  
  
  const getStatus = () => {
    switch(data.status){
      case 'rejected':
        return 'Rejected';
      case 'cancel':
        return 'Cancel';
      default:
        return labels[data.step] || 'pending';
    };
  }
  const getDate = () => moment(data.date ? data.date.toMillis() : Date.now()).format('LL LT');
  const UserCell = props => {
    const title = `${data.authors[0].eng.fname} ${data.authors[0].eng.sname} (${data.authors[0].email})`;
    return data.authors.length && (<abbr title={title}>{ data.authors[0].eng.fname }</abbr>);
  }
  
  
  return (<TableRow hover key={doc.id}>
    <Cell padding="checkbox">
      <Checkbox />
    </Cell>
    <Cell>
      <Link component={RLink} to={`/${jid}/admin/s/${doc.id}/`}>{ data.title.eng }</Link>
    </Cell>
    <Cell>{ getStatus() }</Cell>
    <Cell>
      <Typography noWrap>{ getDate() }</Typography>
    </Cell>
    <Cell><UserCell /></Cell>
  </TableRow>)
}