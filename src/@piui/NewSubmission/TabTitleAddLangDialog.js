import React from 'react';
import isoLangs from 'Modules/isoLangs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

const defaultState = {
  open: false,
  select: "",
};

const TabTitleAddLangDialog = ({ parentData, ...props }) => {
  const [state,setState] = React.useState({ ...defaultState })

  const handleOpen = open => () => setState(s=>({ ...s, open }));
  const handleLangChange = ({ target }) => setState(s=>({ ...s, select:target.value }));
  const handleAdd = () => {
    parentData[1](d=>{
      let title = { ...d.title };
      title.others.push({
        lang: state.select,
        value: "",
      })
      return { ...d, title };
    })
    setState({ ...defaultState });
  }
  
  return (<>
    { props.children && React.cloneElement(props.children, {
      onClick: handleOpen(!state.open),
    }) }
    <Dialog
      fullWidth
      maxWidth="xs"
      open={state.open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>Add Another Language</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Language select</InputLabel>
          <Select value={state.select} onChange={handleLangChange}>
            { Object.keys(isoLangs)
                .map(id=>({ ...isoLangs[id], id }))
                .map((lang,index)=>(<MenuItem value={lang.name} key={lang.id}>
                  {`${lang.name} (${lang.nativeName})`}
                </MenuItem>))
            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleAdd} disabled={!state.select}>Add</Button>
        <Button onClick={handleOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  </>)
}

export default TabTitleAddLangDialog;