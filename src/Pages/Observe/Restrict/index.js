import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { MainContainer } from "@piui";
import propTypes from 'prop-types'

export const ObserveRestrict = ({ back, ...props }) => {
  return (<MainContainer>
    <Dialog fullWidth maxWidth="xs" open={true}>
      <DialogTitle>User Denied</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Only observer can access this page.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button component={Link} to={back}>
          Back
        </Button>
      </DialogActions>
    </Dialog>
  </MainContainer>);
}
ObserveRestrict.propTypes = {
  back: propTypes.string.isRequired,
}