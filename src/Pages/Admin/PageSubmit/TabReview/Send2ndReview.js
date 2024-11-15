import { faPaperPlane } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogContent, DialogActions, TextField, DialogTitle } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import moment from 'moment';
import { AdminSubmitContext } from '../Context';
import { firebase, db } from 'Modules/firebase';
import { sendMail } from 'Method/mailer';

const getNext7Day = () => {
  let date = new Date();
  date = date.setDate(date.getDate() + 7);
  return moment(date).format("YYYY-MM-DD");
}

const Send2ndReview = props => {
  const store = useContext(AdminSubmitContext);
  const { jid, sid } = store.match.params;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(getNext7Day());

  const handleOpen = open => () => setOpen(open);
  const handleSend = async () => {
    await db.collection('journals').doc(jid).collection('submits').doc(sid).update({
      secondReviewDueDate: firebase.firestore.Timestamp.fromDate(new Date(date)).toDate(),
    });
    const { data } = await sendMail('12-2', jid, sid);
    if (data.error) {
      alert(data.message);
    } else {
      console.log(data);
      setOpen(false);
      alert('Send success');
    }
  }


  return (<>
    <Button
      startIcon={<FontAwesomeIcon icon={faPaperPlane} />}
      size="small"
      variant="outlined"
      color="primary"
      onClick={handleOpen(true)}
    >Send E-mail</Button>
    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleOpen(false)}>
      <DialogTitle>ส่งความเห็นครั้งที 2 จากผู้ทรงคุณวุฒิ</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Due Date"
          type="date"
          value={date || ""}
          onChange={e => setDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSend}>Send</Button>
        <Button onClick={handleOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  </>)
}

export default Send2ndReview;