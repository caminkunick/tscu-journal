import React from 'react';
import {
  Box,
  TextField,
  withStyles,
} from '@material-ui/core';
import {
  ThaiTitleSelect,
} from '@piui/Author';


const ThaiNameComp = withStyles(theme=>({
  root: {
    
  },
  space: {
    "&:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
  }
}))( ({ classes, ...props }) => {
  const [ state, setState ] = React.useState({
    title: "นาย",
    othertitle: "",
    fname: "",
    sname: "",
    dept: "",
  });
  
  
  // ==================== H A N D L E ====================
  const getProps = key => ({
    className: classes.space,
    fullWidth: true,
    variant: "outlined",
    value: state[key],
    onChange: handleChange(key),
  });
  const isComplete = () => Boolean(( state.title==="อื่นๆ" ? state.othertitle : state.title ) && state.fname && state.sname && state.dept);
  const handleChange = key => ({ target }) => setState(s=>{
    const newState = { ...s, [key]:target.value }
    return newState;
  });
  
  
  return !props.hidden && (<>
    <ThaiTitleSelect
      className={classes.space}
      fullWidth
      variant="outlined"
      value={state.title}
      onChange={handleChange("title")}
    />
    { state.title==='อื่นๆ' && <TextField
      label="คำนำหน้าอื่นๆ"
      {...getProps('othertitle')}
    /> }
    <TextField
      autoFocus
      label="ชื่อ"
      {...getProps('fname')}
    />
    <TextField
      label="สกุล"
      {...getProps('sname')}
    />
    <TextField
      label="มหาวิทยาลัย / สถาบัน"
      {...getProps('dept')}
    />
    { isComplete() && <Box display="flex" justifyContent="flex-end" mt={5}>
      { props.Next({ tha:state }) }
    </Box> }
  </>)
})

export default ThaiNameComp;