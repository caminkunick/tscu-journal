import React from 'react';
import { connect } from 'react-redux';
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { auth, db, dbTimestamp } from 'Modules/firebase';
import moment from 'moment';
import 'moment/locale/th';
import { labels, SubmitState } from '@piui/State';
import StateActions from './StateActions';
import { MainContainer, Container, ContentHeader } from '@piui';
import Sidebar from '../_sidebar';

// ========== G E T   P A P E R ==========
const getPaper = async ({ jid, sid }) => {
  const paperQuery = await db.collection('journals').doc(jid).collection('submits').doc(sid).get();
  const filesQuery = await db.collection('journals').doc(jid).collection('submits').doc(sid).collection('files').get();
  let data = paperQuery.data();
  data.files = filesQuery.docs.map(file=>({ ...file.data(), id:file.id })).filter((s,i,a)=>!Boolean(s.parent));
  return data;
}


// ========== T A B L E ==========
const TableWrap = withStyles(theme=>({
  root: {
    margin: theme.spacing(1,0,5),
  }
}))(({ classes, ...props })=>(<TableContainer className={classes.root}>
  <Table size="small" {...props} />
</TableContainer>))
const Header = withStyles(theme=>({
  root: {
    fontWeight: 'bold',
  },
}))(props=><Typography variant="h6" {...props} />);
const Cell = withStyles(theme=>({
  head: {
    backgroundColor: theme.palette.grey[700],
    color: "white",
  },
  body: {
    fontSize: 14,
  }
}))(TableCell)


// ========== P A G E   S U M M A R Y ==========
const PageSummary = ({ dispatch, ...props }) => {
  const { jid, sid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    data: {},
  });
  
  
  // ==================== H A N D L E ====================
  const handleChangeStep = action => async () => {
    let log = { date:dbTimestamp(), user:auth.currentUser.uid };
    let updateData = {};
    
    switch(action){
      case 'unrejected':
        updateData = { status:'submitting' };
        log.title = `Administrator unreject paper`;
        break;
      case 'reject':
        updateData = { status:'rejected' };
        log.title = `Administrator reject paper`;
        break;
      case 'next':
        if(state.data.step<5){
          updateData = { step:state.data.step+1 };
          log.title = `Administrator change status to "${labels[state.data.step+1]}"`;
          break;
        } else {
          return false;
        }
      case 'back':
        if(state.data.step>0){
          updateData = { step:state.data.step-1 };
          log.title = `Administrator change status to "${labels[state.data.step-1]}"`;
          break;
        } else {
          return false;
        }
      default:
        return false;
    }
    
    const path = db.collection('journals').doc(jid).collection('submits').doc(sid);
    await path.update(updateData);
    await path.collection('logs').add(log);
    
    getPaper({ jid, sid }).then( data => setState(s=>({ ...s, data })) );
    dispatch({ type:'ALERTS_PUSH', data: { label:'Update success.' } })
  }
  
  
  // L O A D I N G  T E X T
  const LoadingText = text => state.fetched ? text : <Skeleton width={120} />
  
  
  // R E A C T   U S E   E F F E C T
  React.useEffect(()=>{
    document.title = "Information | Phra.in";
    getPaper({ jid, sid }).then( data => setState(s=>({ ...s, data, fetched:true })) );
  }, [ jid, sid ])
  
  
  return (<MainContainer sidebar={<Sidebar {...props} />}><Container maxWidth="md">
    <ContentHeader
      label="Information"
      breadcrumbs={[
        { label:"Home", to:"/" },
        { label:"Administrator" },
        { label:"Submission", to:`/${jid}/admin` },
      ]}
      paragraph
    />
    <Box mb={5} border="solid 1px rgba(0,0,0,0.12)" borderRadius={8} overflow="hidden">
      <SubmitState submit={state.data} />
      <StateActions
        submit={state.data}
        onChange={handleChangeStep}
      />
    </Box>
    {/* ========== T I T L E ========== */}
    <Header>Title</Header>
    <TableWrap>
      <TableHead>
        <TableRow>
          <Cell>Language</Cell>
          <Cell>Title</Cell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow hover>
          <Cell>Thai</Cell>
          <Cell>{ LoadingText(state.fetched && state.data.title.tha) }</Cell>
        </TableRow>
        <TableRow hover>
          <Cell>English</Cell>
          <Cell>{ LoadingText(state.fetched && state.data.title.eng) }</Cell>
        </TableRow>
        { (state.fetched && state.data.title.others) && state.data.title.others.map(({ lang, title })=>(<TableRow hover key={lang}>
          <Cell>{ lang }</Cell>
          <Cell>{ title }</Cell>
        </TableRow>)) }
      </TableBody>
    </TableWrap>
    {/* ========== A U T H O R ========== */}
    <Header>Author</Header>
    <TableWrap>
      <TableHead>
        <TableRow>
          <Cell width="100%">Name</Cell>
          <Cell><Typography noWrap style={{fontSize:'inherit'}}>University / Institute</Typography></Cell>
          <Cell>Contact</Cell>
        </TableRow>
      </TableHead>
      <TableBody>
      {
        state.fetched
          ? state.data.authors.map(({ email, phone, ...author },index)=>(<TableRow hover key={index}>
            <Cell>
              <b>Thai</b>: { (author.tha.othertitle || author.tha.title)+author.tha.fname+" "+author.tha.sname }<br />
              <b>English</b>: { (author.eng.othertitle || author.eng.title)+author.eng.fname+" "+author.eng.sname }
            </Cell>
            <Cell>
              <b>Thai</b>: { author.tha.dept }<br />
              <b>English</b>: { author.eng.dept }
            </Cell>
            <Cell>
              <b>Email</b>: { email }<br />
              <b>Phone</b>: { phone }
            </Cell>
          </TableRow>))
          : (<TableRow>
            <Cell><Skeleton width={120} /></Cell>
            <Cell><Skeleton width={120} /></Cell>
            <Cell><Skeleton width={120} /></Cell>
          </TableRow>)
      }
      </TableBody>
    </TableWrap>
    {/* ========== FILES ========== */}
    <Header>File</Header>
    <TableWrap>
      <TableHead>
        <TableRow>
          <Cell>Name</Cell>
          <Cell align="center">Date</Cell>
        </TableRow>
      </TableHead>
      <TableBody>
      {
        state.fetched
          ? state.data.files
            .sort((a,b)=>(a.name.localeCompare(b.name)))
            .map((file,index)=>(<TableRow key={index}>
              <Cell width="100%">
                <a href={file.url} target="_blank" rel="noopener noreferrer">{ file.name }</a>
              </Cell>
              <Cell>
                <abbr title={moment(file.date.toMillis()).format("LLLL")}>
                  <Typography noWrap style={{fontSize:'inherit'}}>{ moment(file.date.toMillis()).format("L") }</Typography>
                </abbr>
              </Cell>
            </TableRow>))
          : (<TableRow>
            <Cell><Skeleton width={120} /></Cell>
            <Cell><Skeleton width={120} /></Cell>
          </TableRow>)
      }
      </TableBody>
    </TableWrap>
  </Container></MainContainer>)
}

export default connect()(PageSummary);