import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const Cell = withStyles(theme=>({
  head: {
    backgroundColor: theme.palette.grey[200],
    fontWeight: 'bold',
  },
  body: {
    fontSize: theme.typography.body2.fontSize,
  }
}))(TableCell);

const Row = withStyles(theme=>({

}))(props=><TableRow hover {...props} />)

const LoadingRow = props => (<TableRow>
  <Cell colSpan={10}>
    <Skeleton width={`30%`} />
  </Cell>
</TableRow>);

const EmptyRow = props => (<TableRow>
  <Cell colSpan={10}>
    <Typography color="textSecondary" style={{fontSize:'inherit'}}>{ props.children }</Typography>
  </Cell>
</TableRow>)

const SMSTable = props => {
  return (<TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          <Cell width={`100%`}>Title</Cell>
          { props.headOpts && props.headOpts.map(label=><Cell align="center" key={label}>{label}</Cell>) }
          <Cell align="center">Date</Cell>
        </TableRow>
      </TableHead>
      <TableBody>{ props.loading ? <LoadingRow /> : props.children }</TableBody>
    </Table>
  </TableContainer>);
};

export {
  SMSTable,
  Row,
  Cell,
  EmptyRow,
}