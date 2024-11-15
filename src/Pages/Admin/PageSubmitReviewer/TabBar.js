import React from 'react';
import propTypes from 'prop-types';
import { AppBar, Tab, Tabs } from '@material-ui/core';

const labels = ["Invitation","Review","Completion"];

export const TabBar = ({ ...props }) => {
  return (<AppBar position="relative" color="default">
    <Tabs {...props}>
      { labels.map(label=><Tab label={label} key={label} />)}
    </Tabs>
  </AppBar>)
}
TabBar.propTypes = {
  value: propTypes.any.isRequired,
  onChange: propTypes.func.isRequired,
}