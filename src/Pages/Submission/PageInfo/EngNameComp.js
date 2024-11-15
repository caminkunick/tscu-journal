import React from 'react';
import {
  Box,
  TextField,
  withStyles,
} from '@material-ui/core';
import {
  EnglishTitleSelect,
} from '@piui/Author';

const EngNameComp = withStyles(theme=>({
  space: {
    "&:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
  },
}))( ({ classes, ...props }) => {
  const [ state, setState ] = React.useState({
    title: "Mr.",
    othertitle: "",
    fname: "",
    sname: "",
    dept: "",
  })
  
  
  // ==================== C O M P O N E N T S ====================
  const handleChange = key => ({ target }) => setState(s=>{
    const newState = { ...s, [key]:target.value };
    return newState;
  })
  const isComplete = () => Boolean(( state.title==="Others" ? state.othertitle : state.title ) && state.fname && state.sname && state.dept);
  const getProps = key => ({
    className: classes.space,
    variant: "outlined",
    fullWidth: true,
    value: state[key],
    onChange: handleChange(key),
  })
  
  
  return !Boolean(props.hidden) && (<>
    <EnglishTitleSelect
      className={classes.space}
      fullWidth
      variant="outlined"
      value={state.title}
      onChange={handleChange('title')}
    />
    { state.title==="Others" && <TextField
      label="Other title"
      {...getProps('othertitle')}
    /> }
    <TextField
      autoFocus
      label="First name"
      {...getProps('fname')}
    />
    <TextField
      label="Surname"
      {...getProps('sname')}
    />
    <TextField
      label="University / Institute"
      {...getProps('dept')}
    />
    <Box display="flex" justifyContent="flex-end" mt={5}>
      { props.Back }
      { isComplete() && props.Next({ eng:state }) }
    </Box>
  </>)
})

export default EngNameComp;