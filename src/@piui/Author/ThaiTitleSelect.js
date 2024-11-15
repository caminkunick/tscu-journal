import React from 'react';
import {
  MenuItem,
  Select,
} from '@material-ui/core';

const thTitles = ['นาย','นาง','นส.','อาจารย์','อาจารย์ ดร.','ผู้ช่วยศาสตราจารย์','ผู้ช่วยศาสตราจารย์ ดร.','รองผู้ช่วยศาสตราจารย์','รองผู้ช่วยศาสตราจารย์ ดร.','ศาสตราจารย์','ศาสตราจารย์ ดร.','อื่นๆ'];

const ThaiTitleSelect = props => {
  return (<Select defaultValue="นาย" {...props}>
    { thTitles.map(title=>(<MenuItem key={title} value={title}>{title}</MenuItem>)) }
  </Select>)
}

export default ThaiTitleSelect;