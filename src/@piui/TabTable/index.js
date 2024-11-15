import React from 'react';
import {
  Box,
  TableContainer,
  Table as OTable,
  TableHead as OTableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  withStyles,
} from '@material-ui/core';


export const TableHead = withStyles(theme=>({
  wrap: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(0.5,2),
  },
  Typography: {
    fontWeight: 'bold',
  },
}))(({ classes, ...props }) => {
  return <Box className={classes.wrap}>
    <Typography className={classes.Typography} variant="body1">{ props.children }</Typography>
    { props.secondaryActions && (<React.Fragment>
      <Box flexGrow={1} />
      { props.secondaryActions }
    </React.Fragment>) }
  </Box>
})

export const Table = props => (<TableContainer>
  <OTable size="small">
    { props.head && (<OTableHead>{ props.head }</OTableHead>) }
    <TableBody>
      { props.children }
    </TableBody>
  </OTable>
</TableContainer>);

export const Row = props => <TableRow hover {...props} />;
export const Cell = withStyles(theme=>({
  head: {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[600],
    fontSize: theme.typography.caption.fontSize,
    padding: theme.spacing(0,2),
  },
  body: {
    fontSize: theme.typography.caption.fontSize,
  },
}))(({ noWrap, children, ...props })=>{
  return (<TableCell {...props}>
    { noWrap ? <Typography noWrap style={{fontSize:'inherit'}}>{ children }</Typography> : children }
  </TableCell>)
});