import { faPaperPlane, faSpinner } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useContext, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core";
import moment from 'moment';
import 'moment/dist/locale/th';
import { AdminSubmitContext } from "../Context";
import { db } from "Modules/firebase";
import { sendMail } from "Method/mailer";

const getNext7Day = () => {
  let date = new Date();
  date = date.setDate(date.getDate() + 7);
  return moment(date).format('YYYY-MM-DD');
}

const defaultData = {
  year: "",
  volumn: "",
  duedate: getNext7Day(),
}

const SendApprovedPdfEmail = props => {
  const store = useContext(AdminSubmitContext);
  const { jid, sid } = store.match.params;
  const [fetching,setFetching] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ ...defaultData });

  const handleOpen = open => () => fetching ? false : setOpen(open);
  const handleChange = key => e => setData(d => ({ ...d, [key]: (e.target ? e.target.value : e) }));
  const handleSend = async () => {
    setFetching(true);
    await db.collection('journals').doc(jid).collection('submits').doc(sid).update({ approvedPdf:data });
    const result = await sendMail('13', jid, sid);
    setFetching(false);
    if (result.data.error) {
      alert(result.data.message);
    } else {
      setOpen(false);
      alert('Send success');
    }
  }

  return (<>
    <Button
      color="primary"
      size="small"
      variant="outlined"
      startIcon={<FontAwesomeIcon icon={faPaperPlane} />}
      onClick={handleOpen(true)}
    >Send E-mail</Button>
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>ส่งเมลตรวจสอบความถูกต้องของไฟล์</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              variant="outlined"
              label="ปีที่"
              value={data.year}
              onChange={handleChange('year')}
              disabled={fetching}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="ฉบับที่"
              value={data.volumn}
              onChange={handleChange('volumn')}
              disabled={fetching}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="ภายในวันที่"
              value={data.duedate}
              onChange={handleChange('duedate')}
              type="date"
              disabled={fetching}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {
          fetching
            ? <Button disabled startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}>Please wait</Button>
            : (<Fragment>
              <Button
                color="primary"
                disabled={Object.values(data).filter(d=>!d).length}
                onClick={handleSend}
              >Send</Button>
              <Button>Cancel</Button>
            </Fragment>)
        }
      </DialogActions>
    </Dialog>
  </>)
}

export default SendApprovedPdfEmail;