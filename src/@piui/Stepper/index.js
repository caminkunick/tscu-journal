import React from 'react';
import OStepper from '@material-ui/core/Stepper';
import OStep from '@material-ui/core/Step';
import { StepLabel, withStyles, withWidth } from '@material-ui/core';

export const Stepper = withStyles(theme=>({

}))(withWidth()(({ width, ...props })=>{
  const isMobile = ["xs","sm"].includes(width);
  return <OStepper
    alternativeLabel={ isMobile ? false : true }
    orientation={ isMobile ? 'vertical' : 'horizontal' }
    {...props}
  />
}));

export const Step = withStyles(theme=>({

}))(({ label, ...props })=>(<OStep {...props}>
  <StepLabel>{label}</StepLabel>
</OStep>));