import React from 'react';
import propTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const DialogConfirmError = ({ open, onClose, ...props }) => {
  return (<Dialog
    fullWidth
    maxWidth="xs"
    open={open}
    onClose={onClose}
  >
    <DialogTitle>Agreement Checking</DialogTitle>
    <DialogContent>
      <DialogContentText>
        ไม่สามารถเลือก "เป็นผลงานของข้าพเจ้าเพียงผู้เดียว" และ "เป็นผลงานของข้าพเจ้าและผู้ที่ระบุชื่อในบทความ" พร้อมกันได้ กรุณาอ่านตรวจสอบอีกครั้งเพื่อความถูกต้อง
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>)
}
DialogConfirmError.propTypes = {
  open: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
}

export default DialogConfirmError;