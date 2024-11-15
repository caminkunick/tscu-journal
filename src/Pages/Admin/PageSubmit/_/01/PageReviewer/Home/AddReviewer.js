import React from 'react';
import propTypes from 'prop-types';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, withStyles, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell as TBC, IconButton, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { db } from 'Modules/firebase';
import { Skeleton } from '@material-ui/lab';
import { fileLabels, UploadFile } from '@piui/UploadFile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { UploadFile as UploadFileFunc } from 'Modules/Upload';

const TableCell = withStyles(theme=>({
    head: {
        backgroundColor: theme.palette.grey[200],
    },
    body: {
        fontSize: 12,
    },
}))(TBC)

const getReviewers = async (jid,sid) => {
    const querySubmit = await db.collection('journals').doc(jid).collection('submits').doc(sid).get();
    const queryReviewers = await db.collection('journals').doc(jid).collection('users').where('editor','==',true).get();
    
    const submit = querySubmit.data();
    const reviewers = queryReviewers.docs.map(doc=>({ ...doc.data(), id:doc.id }));
    return { submit, reviewers };
}

const AddReviewer = props => {
    const { jid, sid } = props.match.params;
    const [ state, setState ] = React.useState({
        fetched: false,
        fetching: false,
        open: false,
        submit: {},
        reviewers: [],
        files: [],
        selected: "",
    })


    const handleOpen = newOpen => () => !state.fetching && setState(s=>({ ...s, open:newOpen }));
    const handleSelected = ({ target }) => setState(s=>({ ...s, selected:target.value }));
    const handleAddFile = async (file) => setState(s=>({ ...s, files:[ ...s.files, file ] }));
    const handleRemoveFile = index => () => setState(s=>{
        let files = [ ...s.files ];
        files.splice(index, 1);
        return { ...s, files };
    })
    const handleAdd = async () => {
        setState(s=>({ ...s, fetching:true }));

        const promFiles = state.files.map(async (file,index)=>{
            const result = await UploadFileFunc(file.data, progress => {
                setState(s=>{
                    const files = [ ...s.files ];
                    files[index].progress = progress;
                    return { ...s, files };
                })
            });
            setState(s=>{
                const files = [ ...s.files ];
                files[index].result = result;
                return { ...s, files };
            })
        })
        await Promise.all(promFiles);
        await props.onAdd({
            user: state.selected,
            files: state.files,
        });
        handleOpen(false)();
    }


    React.useEffect(()=>{
        getReviewers(jid, sid)
            .then(data=>setState(s=>({ ...s, ...data, fetched:true })));
    }, [ jid, sid ])


    return (<React.Fragment>
        { React.cloneElement(props.children, {
            onClick: handleOpen(true),
        }) }
        <Dialog
            fullWidth
            maxWidth="sm"
            open={state.open}
            onClose={handleOpen(false)}
        >
            <DialogTitle>
                Add Reviewer
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1"><strong>Title</strong></Typography>
                <Typography variant="body2">{ state.fetched ? state.submit.title.tha : <Skeleton width={128} /> }</Typography>
                <Box mb={3} />
                <Typography variant="body1"><strong>Attachment</strong></Typography>
                <Box textAlign="right" mb={1}>
                    {
                        !state.fetching
                            ? (<UploadFile onChange={handleAddFile}>
                                <Button variant="outlined" size="small">Add file</Button>
                            </UploadFile>)
                            : <Button variant="outlined" size="small" disabled>Add file</Button>
                    }
                </Box>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell width="75%">Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                state.files.length
                                    ? state.files.map((file,index)=>(<TableRow hover key={index}>
                                        <TableCell>{ file.data.name }</TableCell>
                                        <TableCell><Typography noWrap variant="body2">{ fileLabels[file.type] }</Typography></TableCell>
                                        <TableCell>
                                            {
                                                !state.fetching
                                                    ? (<IconButton size="small" title="Remove" onClick={handleRemoveFile(index)}>
                                                        <FontAwesomeIcon size="xs" icon={faTrash} />
                                                    </IconButton>)
                                                    : (file.progress || 0)+'%'
                                            }
                                        </TableCell>
                                    </TableRow>))
                                    : (<TableRow>
                                        <TableCell colSpan={10}>
                                            <Typography variant="body2" color="textSecondary">no file</Typography>
                                        </TableCell>
                                    </TableRow>)
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                { !state.files.length && <Typography variant="caption" color="error">* please add file</Typography> }
                <Box mb={3} />
                <FormControl fullWidth>
                    <InputLabel>Select Reviewer</InputLabel>
                    <Select value={state.selected} onChange={handleSelected} disabled={state.fetching}>
                        { state.reviewers.map(rev=>(<MenuItem key={rev.id} value={rev.id}>
                            { ( rev.info && `${rev.info.tha.fname} ${rev.info.tha.sname}` ) || rev.id }
                        </MenuItem>)) }
                    </Select>
                </FormControl>
                { !state.selected && <Typography variant="caption" color="error">* select reviewer</Typography> }
            </DialogContent>
            <DialogActions>
                {
                    !state.fetching
                        ? (<React.Fragment>
                            {
                                state.selected
                                    ? <Button color="primary" onClick={handleAdd}>Add</Button>
                                    : <Button color="primary" disabled>Add</Button>
                            }
                            <Button onClick={handleOpen(false)}>Cancel</Button>
                        </React.Fragment>)
                        : <Button startIcon={<FontAwesomeIcon icon={faSpinner} pulse />} disabled>Please wait</Button>
                }
            </DialogActions>
        </Dialog>
    </React.Fragment>)
}
AddReviewer.propTypes = {
    onAdd: propTypes.func.isRequired,
}

export default AddReviewer;