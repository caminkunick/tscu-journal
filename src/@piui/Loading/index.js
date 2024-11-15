import React from 'react';
import './index.css';
import {
  Backdrop,
} from '@material-ui/core';

const Loading = props => (<Backdrop open={true}>
  <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
</Backdrop>);

export default Loading;