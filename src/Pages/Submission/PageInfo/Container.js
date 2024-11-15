import React from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  withStyles,
} from '@material-ui/core';
import { db, auth } from 'Modules/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCheck } from '@fortawesome/pro-solid-svg-icons';
import ThaiNameComp from './ThaiNameComp';
import EngNameComp from './EngNameComp';
import ContactComp from './ContactComp';
import Recheck from './Recheck';
import { getAuthorName } from 'Method'


const LeftIcon = <FontAwesomeIcon icon={faChevronLeft} />;
const RightIcon = <FontAwesomeIcon icon={faChevronRight} />;
const CheckIcon = <FontAwesomeIcon icon={faCheck} />;
const StyleButton = withStyles(theme=>({
  root: {
    marginLeft: theme.spacing(0.5),
  },
}))(props=><Button variant="outlined" {...props} />);


const PageInfo = ({ jid, dispatch, ...props }) => {
  const [ activeStep, setActiveStep ] = React.useState(0);
  const labels = ["Thai name","English name","Contact","Confirm"];
  const [ data, setData ] = React.useState({
    tha: {
      title: "นาย",
      othertitle: "",
      fname: "",
      sname: "",
      dept: "",
    },
    eng: {
      title: "Mr.",
      othertitle: "",
      fname: "",
      sname: "",
      dept: "",
    },
    phone: "",
    email: "",
  })
  
  const langTest = lang => !Object.keys(data[lang])
    .filter(s=> !["อื่นๆ","Others"].includes(data[lang].title) ? s!=="othertitle" : true)
    .map(key=>Boolean(data[lang][key]))
    .includes(false);
  const ValidateEmail = email => ( (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)) ? true : false )
  const emailTest = () => ValidateEmail(data.email);
  const phoneTest = () => Boolean((data.phone+"").length);
  const isComplete = () => langTest('tha') && langTest('tha') && phoneTest() && emailTest();
  
  const handleChageStep = action => () => {
    switch(action){
      case "next":
        return setActiveStep(a=>(a<labels.length ? a+1 : a))
      case "back":
        return setActiveStep(a=>(a>0 ? a-1 : a))
      default:
        return null;
    }
  }
  const handleChage = newData => setData(d=>({ ...d, ...newData }));
  const handleConfirm = async () => {
    const user = auth.currentUser;
    if(user && isComplete()){
      const path = db.collection("journals").doc(jid).collection("users").doc(user.uid);
      const query = await path.get();
      user.updateProfile({ displayName:getAuthorName(data.tha) });
      if(query.exists){
        await path.update({ info:data })
      } else {
        await path.set({ info:data })
      }
      dispatch({ type:"ALERTS_PUSH", data:{ label: "Update your information success." } })
      props.onCompleted();
    }
  }
    
  
  // ==================== C O M P O N E N T S ====================
  const Next = (newData) => <StyleButton
    endIcon={RightIcon}
    onClick={()=>{
      handleChage(newData)
      handleChageStep('next')();
    }}
    key={'next'}
    color="primary"
  >Next</StyleButton>;
  const Back = <StyleButton startIcon={LeftIcon} onClick={handleChageStep('back')} key={'back'}>Back</StyleButton>;
  const Confirm = <StyleButton color="primary" startIcon={CheckIcon} onClick={handleConfirm}>Confirm</StyleButton>
  
  
  return (<Container maxWidth="sm">
    <Box my={5}>
      <Stepper alternativeLabel activeStep={activeStep}>
        { labels.map(label=>(<Step key={label}>
          <StepLabel>
            <Typography noWrap variant="caption">{ label }</Typography>
          </StepLabel>
        </Step>)) }
      </Stepper>
      <ThaiNameComp hidden={activeStep!==0} Next={Next} />
      <EngNameComp hidden={activeStep!==1} {...{Next,Back}} />
      <ContactComp hidden={activeStep!==2} {...{Next,Back}} />
      <Recheck hidden={activeStep!==3} data={data} {...{Confirm,Back}} />
    </Box>
  </Container>)
}


export default connect()(PageInfo);