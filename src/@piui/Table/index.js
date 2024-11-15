import React from 'react';
import {
  TableContainer,
  Table as OTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  withStyles,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

export const Cell = withStyles(theme=>({
  head: {
    backgroundColor: theme.palette.grey[200],
    fontWeight: 'bold',
  },
  body: {
    fontSize: 12,
  },
}))(TableCell)

export const Row = withStyles(theme=>({

}))(props=><TableRow hover {...props} />)

export const LoadingRow = props => (<Row>
  <Cell colSpan={10}>
    <Skeleton width={`30%`} />
  </Cell>
</Row>);

export const Table = withStyles(theme=>({

}))(props=>{
  return (<TableContainer>
    <OTable size="small">
      <TableHead>{ props.head }</TableHead>
      <TableBody>
        { props.loading ? <LoadingRow /> : props.children }
      </TableBody>
    </OTable>
  </TableContainer>)
})