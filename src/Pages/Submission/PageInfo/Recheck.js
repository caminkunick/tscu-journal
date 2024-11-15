import React from 'react';
import propTypes from 'prop-types';
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@material-ui/core';


const Recheck = ({ classes, data, ...props }) => {
  return !props.hidden && data && (<>
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow hover>
            <TableCell>Name</TableCell>
            <TableCell width="100%">
              <Typography noWrap>
                <b>Thai:</b>&nbsp;
                {data.tha.title==="อื่นๆ" ? data.tha.othertitle : data.tha.title }
                {data.tha.fname}&nbsp;
                {data.tha.sname}
              </Typography>
              <Typography noWrap>
                <b>English:</b>&nbsp;
                {data.eng.title==="Others" ? data.eng.othertitle : data.eng.title }
                {data.eng.fname}&nbsp;
                {data.eng.sname}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>
              <Typography noWrap>University / Institute</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap><b>Thai</b>:&nbsp;{data.tha.dept}</Typography>
              <Typography noWrap><b>English</b>:&nbsp;{data.eng.dept}</Typography>
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>E-mail</TableCell>
            <TableCell>{data.email}</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>Phone</TableCell>
            <TableCell>{data.phone}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <Box mt={5} display="flex" justifyContent="flex-end">
      { props.Back }
      { props.Confirm }
    </Box>
  </>)
}
Recheck.propTypes = {
  data: propTypes.shape({
    tha: propTypes.shape({
      title: propTypes.string,
      othertitle: propTypes.string,
      fname: propTypes.string,
      sname: propTypes.string,
      dept: propTypes.string,
    }),
    eng: propTypes.shape({
      title: propTypes.string,
      othertitle: propTypes.string,
      fname: propTypes.string,
      sname: propTypes.string,
      dept: propTypes.string,
    }),
    email: propTypes.string,
    phone: propTypes.string,
  }).isRequired,
}

export default Recheck;