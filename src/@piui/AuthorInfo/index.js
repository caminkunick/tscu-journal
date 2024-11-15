import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  TextField,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme=>({
  section: {
    border: 'solid 1px #CCC',
    borderRadius: theme.spacing(1),
    position: 'relative',
    padding: theme.spacing(3,2),
  },
  label: {
    position: 'absolute',
    top: -13,
    left: 16,
    background: 'white',
    color: '#999',
    padding: theme.spacing(0.5),
  },
  dialogtitle: {
    backgroundColor: '#EEE',
  },
  dialogcontent: {
    padding: theme.spacing(0,3),
  },
}));

const ValidateEmail = email => ( (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)) ? true : false )

const Section = props => {
  const classes = useStyles();
  return (<div className={classes.section}>
    <div className={classes.label}>{props.label}</div>
    {props.children}
  </div>)
}

const SelectTitle = props => {
  const { lists, children, ...other } = props;
  return (<Box display="flex" alignItems="flex-end">
    <FormControl variant="outlined">
      <InputLabel id="title-th-label">{other.label}</InputLabel>
      <Select labelId="title-th-label" {...other}>
        { lists.map(title=>(<MenuItem key={title} value={title}>{title}</MenuItem>)) }
      </Select>
    </FormControl>
    { children ? (<Box flexGrow={1} pl={2}>{children}</Box>) : null }
  </Box>)
}

const initData = {
  tha: { title:'นาย', fname:'', sname:'', dept:'', othertitle:'' },
  eng: { title:'Mr.', fname:'', sname:'', dept:'', othertitle:'' },
  email: '',
  phone: '',
  sender: false,
};

const EnhanceAuthorDialog = props => {
  const classes = useStyles();
  const { data, button, onConfirm, dispatch } = props;
  const [ state, setState ] = React.useState({
    open: false,
    fetching: false,
  });
  const [ tempData, setTempData ] = React.useState({...(data || initData)});
  const inputRef = {
    tha: {
      title: React.useRef(),
      fname: React.useRef(),
      sname: React.useRef(),
      dept: React.useRef(),
      othertitle: React.useRef(),
    },
    eng: {
      title: React.useRef(),
      fname: React.useRef(),
      sname: React.useRef(),
      dept: React.useRef(),
      othertitle: React.useRef(),
    },
    email: React.useRef(),
    phone: React.useRef(),
  }
  const titles = ['นาย','นาง','นส.','อาจารย์','อาจารย์ ดร.','ผู้ช่วยศาสตราจารย์','ผู้ช่วยศาสตราจารย์ ดร.','รองผู้ช่วยศาสตราจารย์','รองผู้ช่วยศาสตราจารย์ ดร.','ศาสตราจารย์','ศาสตราจารย์ ดร.','อื่นๆ'];
  const enTitles = ['Mr.','Mrs.','Miss','Lecture','Dr.','Assistant Professer','Assistant Professer Dr.','Associate Professer','Associate Professer Dr.','Professer','Professer Dr.','Others'];

  const getProps = (label,lang,key) => ({
    label,
    fullWidth: true,
    value: tempData[lang][key],
    onChange: handleChange(lang,key),
    onKeyUp: ({ keyCode }) => ( keyCode===13 ? handleConfirm() : false ),
    inputRef: inputRef[lang][key],
    disabled: state.fetching,
    style: {
      marginTop: 16,
    },
  })
  const defaultProps = {
    fullWidth: true,
    onKeyUp: ({ keyCode }) => ( keyCode===13 ? handleConfirm() : false ),
    disabled: state.fetching,
  }

  
  // ============================================================
  // H A N D L E
  // ============================================================
  const handleAlert = (label,severity="warning") => dispatch({ type:'ALERTS_PUSH', data:{label,severity} });
  const handleOpen = (open=true) => () => setState(s=>({ ...s, open }));
  const handleChange = (lang,key) => ({ target }) => setTempData(t=>{
    let temp = { ...t };
    temp[lang][key] = target.value;
    return { ...temp };
  })
  const handleChangeCheck = ({ target }) => setTempData(t=>({ ...t,  sender:target.checked }));
  const handleContactChange = key => ({ target }) => setTempData(t=>({ ...t,  [key]:target.value }));
  const handleReset = () => setTempData({...initData});
  const handleConfirm = async () => {
    // T I T L E
    if(tempData.tha.title==='อื่นๆ' && !tempData.tha.othertitle){
      handleAlert('Please fill thai title');
      inputRef.tha.othertitle.current.focus();
      return false;
    }
    if(tempData.eng.title==='Others' && !tempData.eng.othertitle){
      handleAlert('Please fill english title');
      inputRef.eng.othertitle.current.focus();
      return false;
    }
    // D E F A U L T
    const langs = ['tha','eng'];
    const keys = ['fname','sname','dept'];
    
    const allangs = {tha:'thai',eng:'english'};
    const alkeys = {'fname':'first name','sname':'surname','dept':'university/institute'};
    
    for(let l=0; l<langs.length; l++){
      for(let k=0; k<keys.length; k++){
        const val =  tempData[ langs[l] ][ keys[k] ];
        if(!val){
          const ref = inputRef[ langs[l] ][ keys[k] ];
          handleAlert(`Please fill ${allangs[langs[l]]} ${alkeys[keys[k]]}`);
          ref.current.focus();
          return false;
        }
      }
    }
    // E M A I L
    let tempEmail = tempData.email.trim().toLowerCase().replace(/[^a-z0-9_.@]/gi,"");
    if(!tempEmail){
      inputRef.email.current.focus();
      handleAlert(`Please fill email`);
      return false;
    }
    if(!ValidateEmail(tempEmail)){
      setTempData(t=>({ ...t, email:tempEmail }));
      inputRef.email.current.focus();
      handleAlert(`Email invalid format`);
      return false;
    }
    // P H O N E
    let numLength = tempData.phone.replace(/[^0-9]/gi,"");
    if(!tempData.phone){
      inputRef.phone.current.focus();
      handleAlert(`Please fill phone number`);
      return false;
    }
    if(numLength.length<10){
      inputRef.phone.current.focus();
      handleAlert(`Phone number incorrect`);
      return false;
    }
    // C A L C U L A T E
    setState(s=>({ ...s, fetching:true }))
    
    await onConfirm(tempData);
    if(!props.noReset){ handleReset(); }
    handleOpen(false)();
    setState(s=>({ ...s, fetching:false }))
  }

  
  // ============================================================
  // E L E M E N T
  // ============================================================
  const ToggleButton = button && React.cloneElement(button, {
    onClick: handleOpen(!state.open),
  });


  React.useEffect(()=>{
    if(data){
      setTempData(data);
    }
  }, [ data ]);

  
  // ============================================================
  // R E N D E R
  // ============================================================
  return (<>
    { ToggleButton }
    <Dialog
      fullWidth
      maxWidth="sm"
      scroll="body"
      open={state.open}
      onClose={handleOpen(false)}
    >
      <DialogTitle><b>{ props.title || 'Add Author' }</b></DialogTitle>
      <DialogContent className={classes.dialogcontent}>
        <Section label="ไทย">
          <SelectTitle
            lists={titles}
            label="คำนำหน้า"
            value={tempData.tha.title}
            onChange={handleChange('tha','title')}
            disabled={state.fetching}
            autoFocus
          >
            { tempData.tha.title==='อื่นๆ' ? (<TextField {...getProps('คำนำหน้าอื่นๆ','tha','othertitle')} style={{}} />) : null }
          </SelectTitle>
          <TextField {...getProps('ชื่อ','tha','fname')} />
          <TextField {...getProps('สกุล','tha','sname')} />
          <TextField {...getProps('มหาวิทยาลัย / สถาบัน','tha','dept')} />
        </Section>
        <Box mb={3} />
        <Section label="English">
          <SelectTitle
            lists={enTitles}
            label="Title"
            value={tempData.eng.title}
            onChange={handleChange('eng','title')}
            disabled={state.fetching}
          >
            { tempData.eng.title==='Others' ? (<TextField {...getProps('Others title','eng','othertitle')} style={{}} />) : null }
          </SelectTitle>
          <TextField {...getProps('First name','eng','fname')} />
          <TextField {...getProps('Surname','eng','sname')} />
          <TextField {...getProps('University / Institute','eng','dept')} />
        </Section>
        <Box mb={3} />
        <Section label="Contact">
          <TextField
            {...defaultProps}
            label="Email"
            value={tempData.email}
            onChange={handleContactChange('email')}
            inputRef={inputRef.email}
          />
          <Box mb={2} />
          <TextField
            {...defaultProps}
            label="Phone"
            value={tempData.phone}
            onChange={handleContactChange('phone')}
            inputRef={inputRef.phone}
          />
        </Section>
        <Box mt={2} hidden={props.disabledCheckbox}>
          <FormControlLabel control={<Checkbox color="primary" checked={tempData.sender} onChange={handleChangeCheck} />} label="Save as my default information" />
        </Box>
      </DialogContent>
      <DialogActions>
        { !props.noReset ? <Button color="secondary" onClick={handleReset}>Reset</Button> : null }
        <Box flexGrow={1} />
        <Button color="primary" onClick={handleConfirm}>Confirm</Button>
        <Button onClick={handleOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  </>)
}
EnhanceAuthorDialog.propTypes = {
  onConfirm: propTypes.func.isRequired,
  button: propTypes.node.isRequired,
}

export default connect()(EnhanceAuthorDialog);
