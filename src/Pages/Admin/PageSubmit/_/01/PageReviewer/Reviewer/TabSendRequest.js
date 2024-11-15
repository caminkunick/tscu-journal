import React from 'react';
import { Box, withStyles, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/pro-solid-svg-icons';
import moment from 'moment';
import 'moment/locale/th';
import { UploadFile } from '@piui/UploadFile';


const TextHeader = withStyles(theme=>({
    root: {
        display: 'flex',
        alignItems: 'flex-end',
        fontWeight: 'bold',
        marginBottom: theme.spacing(1),
    }
}))(Box);
const TextBody = withStyles(theme=>({
    root: {
        fontSize: '0.75rem !important',
    },
}))(Box);
const Cell = withStyles(theme=>({
    head: {
        backgroundColor: theme.palette.grey[200],
    },
    body: {
        fontSize: '0.75rem !important',
    },
}))(TableCell);
const DueDate = props => {
    const nowDate = new Date();
    const duedates = [
        { label:"Editor's", date:nowDate },
        { label:"Response", date:nowDate.setDate(nowDate.getDate()+7) },
        { label:"Review", date:nowDate.setDate(nowDate.getDate()+7) },
    ]
    return (<Grid container>
        {
            duedates.map((item,index)=>(<Grid item xs={12} md={4} key={index}><Box textAlign="center" mb={3}>
                <div><strong>{ moment(item.date).format('L') }</strong></div>
                <div>{ item.label } due date</div>
            </Box></Grid>))
        }
    </Grid>)
}

const TabSendRequest = ({ hidden, submit, ...props }) => {
    const [ state, setState ] = React.useState({
        requesting: false,
        files: [],
    })

    const handleUpload = data => setState(s=>{
        let files = [ ...s.files, data ];
        return { ...s, files };
    })
    const handleRequest = async () => {
        console.log('handleRequest');
    }

    return !hidden && (<Box p={3} border="solid 1px rgba(0,0,0,0.12)">
        <TextHeader>Title</TextHeader>
        <TextBody>
            <div>Thai: { submit.title.tha }</div>
            <div>English: { submit.title.eng }</div>
        </TextBody>
        <Box mb={3} />
        <TextHeader>
            Files
            <Box flexGrow={1} />
            <UploadFile onChange={handleUpload}>
                <Button variant="outlined" size="small"
                    startIcon={<FontAwesomeIcon icon={faUpload} />}
                >Upload</Button>
            </UploadFile>
        </TextHeader>
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <Cell>Name</Cell>
                        <Cell>Type</Cell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    state.files.length
                        ? state.files.map((file,index)=>(<TableRow key={index}>
                            <Cell>{ file.data.name }</Cell>
                            <Cell>{ file.type }</Cell>
                        </TableRow>))
                        : (<TableRow>
                            <Cell colSpan={12}>
                                <Typography variant="body2" color="textSecondary">no file</Typography>
                            </Cell>
                        </TableRow>)                    
                }
                </TableBody>
            </Table>
        </TableContainer>
        { !state.files.length && <Typography paragraph variant="caption" color="error">* please upload file</Typography> }
        <Box mb={3} />
        <TextHeader>Due Date</TextHeader>
        <TextBody>
            <DueDate />
        </TextBody>
        {
            ( state.files.length )
                ? <Button variant="outlined" color="primary" onClick={handleRequest}>Send Request</Button>
                : <Button variant="outlined" disabled>Send Request</Button> 
        }
    </Box>);
}

export default TabSendRequest;