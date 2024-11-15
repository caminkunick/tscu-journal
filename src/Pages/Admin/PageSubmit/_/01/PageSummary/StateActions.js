import React from 'react';
import propTypes from 'prop-types';
import {
  Box,
  Button,
  withStyles,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faChevronRight, faChevronLeft, faUndo } from '@fortawesome/pro-solid-svg-icons';

const SmallBtn = withStyles(theme=>({
  
}))(({ ...props })=><Button variant="outlined" size="small" {...props} />)

const StateActions = withStyles(theme=>({
  root: {
    padding: theme.spacing(3),
    paddingTop: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
}))(({ classes, submit, onChange, ...props }) => {
  let children = [];
  
  const Unrejected = <SmallBtn icon={faBan} color="secondary" key="unrejected" onClick={onChange('unrejected')}
    startIcon={<FontAwesomeIcon icon={faUndo} />}
  >Unrejected</SmallBtn>;
  const Rejected = <SmallBtn icon={faBan} color="secondary" key="rejected" onClick={onChange('reject')}
    startIcon={<FontAwesomeIcon icon={faBan} />}
  >Reject</SmallBtn>;
  const Next = <SmallBtn key="next" color="primary" onClick={onChange('next')}
    endIcon={<FontAwesomeIcon icon={faChevronRight} />}
  >Next</SmallBtn>;
  const Back = <SmallBtn key="back" onClick={onChange('back')}
    startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
  >Back</SmallBtn>;
  
  if(submit.status==='rejected'){
    children = [ Unrejected ];
  } else if(submit.step===0){
    children = [ Rejected, Next ];
  } else if(submit.step>0 && submit.step<5){
    children = [ Back, Next ];
  } else if(submit.step===5){
    children = [ Back ];
  }
  
  return submit.status!=='cancel' && <Box className={classes.root} children={children} />;
})
StateActions.propTypes = {
  submit: propTypes.shape({
    state: propTypes.string,
    step: propTypes.number,
  }),
  onChange: propTypes.func.isRequired,
}

export default StateActions;