import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { Button, ListItem } from '@material-ui/core';
import { Link } from 'react-router-dom';

const BackLink = props => {
  return (<ListItem divider>
    <Button
      component={Link}
      startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
      to={props.to}
    >Back</Button>
  </ListItem>)
}

export default BackLink;