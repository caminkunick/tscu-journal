import React from 'react';
import {
  Button,
  List,
  ListItemText,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/pro-solid-svg-icons';

export default props => {


  return (<>
    { props.children && React.cloneElement(props.children, {
      onClick: ()=>null,
    }) }
  </>)
}