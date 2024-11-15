import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  withWidth,
  withStyles,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';

const labels = ['Pending','Submit','Review','Edit','Approved','Published'];


const SubmitState = withStyles(theme=>({
  warnicon: {
    fontSize: theme.spacing(3),
    color: theme.palette.warning.main,
  },
  erricon: {
    fontSize: 24,
    color: theme.palette.secondary.main,
  },
}))(withWidth()(({ classes, submit={}, width, ...props }) => {
  const isMobile = ['xs','sm'].includes(width);
  let steps = [];
  
  
  // ==================== E L E M E N T ====================
  const QuestionIcon = props => <FontAwesomeIcon className={classes.warnicon} icon={faQuestionCircle} />;
  const TimesIcon = props => <FontAwesomeIcon className={classes.erricon} icon={faTimesCircle} />;
  
  
  if(submit.status === "submitting"){
    steps = labels.map((label,index) => <Step key={label}
      children={
        index===submit.step
          ? <StepLabel icon={<QuestionIcon />}><b>{label}</b></StepLabel>
          : <StepLabel>{label}</StepLabel>
      }
    />);
  } else {
    const elseLabels = { rejected:"Rejected", cancel:"Cancel" };
    steps = labels.map((label,index) => {
      let children = null;
      if(submit.step===index){
        children = <StepLabel icon={<TimesIcon />} children={<b>{elseLabels[submit.status]}</b>} />;
      } else if(submit.step>index){
        children = <StepLabel icon={<TimesIcon />} children={label} />;
      } else {
        children = <StepLabel children={label} />;
      }
      return <Step key={index} children={children} />;
    });
  }
  
  return (<Stepper
    activeStep={ submit.step || 0 }
    alternativeLabel={ !isMobile }
    orientation={ isMobile ? 'vertical' : 'horizontal' }
    className={ classes.root }
    children={steps}
  />);
}));

export {
  labels,
  SubmitState,
};