import React, { Fragment } from 'react';
import { Attachments, ConfirmDialog } from '@piui';
import ReviewForm from '@piui/ReviewForm/Make';
import { Header } from '@piui/Review';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Link, Typography } from '@material-ui/core';
import reviewdoc from 'Assets/reviewer_form.doc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faDownload, faPaperPlane, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { sendMail } from 'Method/mailer';

const ExpandIcon = props => <FontAwesomeIcon size="xs" icon={faChevronDown} />

const TabReview = ({ reviewer, onChange, ...props }) => {
  const [ state, setState ] = React.useState({
    expand: null,
    fetching: false,
  });
  const [commentData,setCommentData] = React.useState(null);
  const submitConfirm = commentData && Object.keys(commentData).filter(key=>key.indexOf('text')===-1).filter(key=>!commentData[key]).length===0;

  const handleChangeExpand = expand => () => setState(s=>({ ...s, expand: (s.expand===expand ? null : expand) }));
  const handleSendMail = async () => {
    const mailResult = await sendMail('07-1',reviewer.jid,reviewer.rid);
    if(mailResult.data.error){
      alert(mailResult.data.message);
    }
    const mailResult2 = await sendMail('07-2',reviewer.jid,reviewer.rid);
    if(mailResult2.data.error){
      alert(mailResult2.data.message);
    }
  }
  const handleUpload = group => async file => {
    const files = await reviewer.addFile(group,file);
    await handleSendMail();
    onChange({ files });
  }
  const handleSend = async () => {
    setState(s=>({ ...s, fetching:true }));
    const request = await reviewer.saveComment(commentData);
    await handleSendMail();
    onChange({ request });
    setState(s=>({ ...s, fetching:false }));
  }


  React.useEffect(()=>{
    if(reviewer.request.comment){ setState(s=>({ ...s, expand:'form' })) }
  }, [ reviewer.request.comment ])



  return reviewer.request.step>0
  ? (
    reviewer.request.schedule
      ? (<React.Fragment>
        <Attachments
          label="Review Files"
          fetched={true}
          files={reviewer.getFilesByGroup('review')}
        />
        <Box mt={5} />
        <Header>Download file or Complete form below</Header>
        <Accordion expanded={state.expand==='download'} onChange={handleChangeExpand('download')}>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography>Download</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box flexGrow={1}>
              <Box align="center">
                <Link href={reviewdoc}>
                  <FontAwesomeIcon icon={faDownload} size="4x" />
                  <br /><br />
                  Download
                </Link>
                <Box mt={5} />
                <Attachments
                  label="Review Upload"
                  files={reviewer.getFilesByGroup('review-upload')}
                  onAdd={handleUpload('review-upload')}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={state.expand==='form'} onChange={handleChangeExpand('form')}>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography>Complete Form</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box width="100%">
              {
                state.fetching
                  ? (<Box textAlign="center">
                    <Button variant="outlined" disabled size="large" startIcon={<FontAwesomeIcon icon={faSpinner} pulse />}>Please wait</Button>
                  </Box>)
                  : (<Fragment>
                    <ReviewForm
                      comment={reviewer.request.comment}
                      onChange={data=>setCommentData(data)}
                    />
                    <Box mt={5} />
                    <Attachments
                      label="Addition Files"
                      files={reviewer.getFilesByGroup('addition-files')}
                      onAdd={reviewer.request.comment ? null : handleUpload('addition-files')}
                    />
                    { !Boolean(reviewer.request.comment) && (<Box textAlign="center" mt={5}>
                      <ConfirmDialog
                        label={<>เมื่อส่งข้อมูลแล้วไม่สามารถแก้ไขได้<br />คุณต้องการดำเนินการต่อหรือไม่?</>}
                        onConfirm={handleSend}
                      >
                        <Button
                          size="large"
                          color="primary"
                          disableElevation
                          variant="contained"
                          disabled={!submitConfirm}
                          startIcon={<FontAwesomeIcon icon={faPaperPlane} />}
                        >Submit Form</Button>
                      </ConfirmDialog>
                    </Box>) }
                  </Fragment>)
              }
            </Box>
          </AccordionDetails>
        </Accordion>
      </React.Fragment>)
      : (<Typography color="textSecondary">waiting for administrator</Typography>)
  )
  : (<Typography color="textSecondary">Stage not initiated.</Typography>)
}

export default TabReview;