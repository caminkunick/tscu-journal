import React from 'react';
import propTypes from 'prop-types';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, List, Divider, ListItem, ListItemText } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/pro-solid-svg-icons';

export const fileLabels = {
    article: 'บทความ (Article text)',
    ref: 'รายการอ้างอิงภาษาไทย (Thai Reference)',
    figure: 'ภาพประกอบ (Figure)',
    diagram: 'ตาราง, แผนภาพ (Table, Diagram)',
    fonts: 'อักขระพิเศษ (Special fonts)',
};

export const UploadFile = ({ withType, ...props }) => {
    const [ state, setState ] = React.useState({
        open: false,
        data: null,
        type: 'article',
    })

    const handleOpen = open => () => setState(s=>({ ...s, open }));
    const handleChange = ({ target }) => target.files.length && setState(s=>({ ...s, data:target.files[0] }));
    const handleRemoveFile = () => setState(s=>({ ...s, data:null }));
    const handleChangeType = ({ target }) => setState(s=>({ ...s, type:target.value }));
    const handleAdd = async () => {
        props.onChange({ data:state.data, type:state.type });
        setState(s=>({ ...s, open:false, data:null, type:'article' }))
    }

    const EnhanceButton = props => (<Button variant="outlined"
        startIcon={<FontAwesomeIcon icon={faFolderOpen} />}
    >Upload File</Button>);

    return (<React.Fragment>
        { React.cloneElement((props.children || EnhanceButton), {
            onClick: handleOpen(true),
        }) }
        <Dialog fullWidth maxWidth="xs" open={state.open} onClose={handleOpen(false)}>
            <DialogTitle>Upload File</DialogTitle>
            <DialogContent>
                {
                    state.data
                        ? (<React.Fragment>
                            <List>
                                <Divider />
                                <ListItem divider>
                                    <ListItemText primary={state.data.name} />
                                </ListItem>
                            </List>
                            {
                                withType && (<React.Fragment>
                                    <Box mb={3} />
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>File Type</InputLabel>
                                        <Select fullWidth label="File type" value={state.type} onChange={handleChangeType}>
                                            {
                                                Object.keys(fileLabels)
                                                    .map(key=>({ label:fileLabels[key], key }))
                                                    .map(label=><MenuItem value={label.key} key={label.key}>{ label.label }</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </React.Fragment>)
                            }
                        </React.Fragment>)
                        : (<React.Fragment>
                            <input id="browse-file" type="file" hidden onChange={handleChange} />
                            <label htmlFor="browse-file">
                                <Button variant="outlined" fullWidth size="large" component="span"
                                    startIcon={<FontAwesomeIcon icon={faFolderOpen} />}
                                >Browse</Button>
                            </label>
                        </React.Fragment>)
                }
            </DialogContent>
            <DialogActions>
                { state.data && <Button color="secondary" onClick={handleRemoveFile}>Delete</Button> }
                <Box flexGrow={1} />
                { state.data && <Button color="primary" onClick={handleAdd}>Add</Button> }
                <Button onClick={handleOpen(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>);
}
UploadFile.propTypes = {
    onChange: propTypes.func.isRequired,
}