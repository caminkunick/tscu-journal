import React from 'react';
import propTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@material-ui/core';
import isoLangs from 'Modules/isoLangs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';


const defaultState = {
  fetching: false,
  open: false,
}
const defaultData = {
  lang: false,
  value: "",
}

const DialogAdd = ({ onConfirm, ...props }) => {
  const [ state, setState ] = React.useState({ ...defaultState })
  const [ data, setData ] = React.useState({ ...defaultData });
  

  const handleOpen = open => () => !state.fetching && setState(s=>({ ...s, open }));
  const handleLangChange = ({ target }) => setData(d=>({ ...d, lang:target.value }));
  const handleValueChange = ({ target }) => setData(d=>({ ...d, value:target.value }));
  const handleConfirm = async () => {
    setState(s=>({ ...s, fetching:true }));
    await onConfirm(data);
    setState(s=>({ ...defaultState }));
    setData(s=>({ ...defaultData }));
  }

  
  return (<>
    <Button size="small" color="primary" onClick={handleOpen(true)}>Add Title</Button>
    <Dialog
      fullWidth
      maxWidth="xs"
      open={state.open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>Add Language</DialogTitle>
      <DialogContent>
        <Select fullWidth value={data.lang} onChange={handleLangChange} disabled={state.fetching}>
          <MenuItem value={false}>-- Select Language --</MenuItem>
          { Object.values(isoLangs).map(lang=>(<MenuItem key={lang.name} value={lang.name}>
            {lang.name} [{lang.nativeName}]
          </MenuItem>)) }
        </Select>
        <Box mt={3} />
        <TextField
          fullWidth
          label={(data.lang ? data.lang+" " : "")+`Title`}
          value={state.addValue}
          onChange={handleValueChange}
          disabled={state.fetching}
        />
      </DialogContent>
      <DialogActions>
        {
          state.fetching
            ? <Button startIcon={<FontAwesomeIcon icon={faSpinner} pulse />} disabled>Please Wait</Button>
            : (<React.Fragment>
              <Button color="primary" disabled={!data.lang || !data.value} onClick={handleConfirm}>Add</Button>
              <Button onClick={handleOpen(false)}>Cancel</Button>
            </React.Fragment>)
        }
      </DialogActions>
    </Dialog>
  </>);
}
DialogAdd.propTypes = {
  onConfirm: propTypes.func.isRequired,
}

export default DialogAdd;