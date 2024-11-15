import React from 'react';
import {
  MenuItem,
  Select,
} from '@material-ui/core';


const titles = ['Mr.','Mrs.','Miss','Lecture','Dr.','Assistant Professer','Assistant Professer Dr.','Associate Professer','Associate Professer Dr.','Professer','Professer Dr.','Others'];

const EngNameComp = props => {
  return (<Select defaultValue="Mr." {...props}>
    { titles.map(title=>(<MenuItem key={title} value={title}>
      { title }
    </MenuItem>)) }
  </Select>)
}

export default EngNameComp;