import React from 'react';
import {
  Divider,
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
import moment from 'moment';
import 'moment/locale/th';
import { db } from 'Modules/firebase';
import { MainContainer, Container, ContentHeader } from '@piui';
import Sidebar from '../_sidebar';

// ========== G E T   P A P E R ==========
const getPaper = async ({ jid, sid }) => {
  
  const path = db.collection('journals').doc(jid).collection('submits').doc(sid);
  const query = await path.get();
  const queryTimeline = (await path.collection('logs').get()).docs.map(doc=>({
    ...doc.data(),
    id:doc.id,
    date:doc.data().date.toMillis(),
  }));
  
  const timelines = ([
    { title:"Submit Paper", date:query.data().date.toMillis(), user:query.data().user },
    ...queryTimeline,
  ]).sort((a,b)=>(b.date - a.date));
  const uids = timelines
    .map(timeline=>timeline.user)
    .filter((s,i,a)=>a.indexOf(s)===i)
    .map( uid => db.collection('journals').doc(jid).collection('users').doc(uid).get());
  let users = {};
  (await Promise.all(uids)).forEach(doc=>{
    const userData = doc.data();
    if(userData.info){
      const profile = userData.info;
      users[doc.id] = `${profile.tha.fname} ${profile.tha.sname}`;
    } else {
      users[doc.id] = userData.displayName || userData.email || doc.id;
    }
  });
  
  return { timelines, users };
}


// ==================== C O M P O N E N T S ====================
const Cell = withStyles(theme=>({
  root: {
    fontSize: 14,
    '& .MuiTypography-root': {
      fontSize: 'inherit',
    }
  },
  head: {
    backgroundColor: theme.palette.grey[700],
    color: 'white',
  },
}))(TableCell)


// ==================== M A I N ====================
const PageTimeline = ({ ...props }) => {
  const { jid, sid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    timelines: [],
    users: {},
  })
  
  
  React.useEffect(()=>{
    document.title = "Timeline | Phra.in"
    getPaper({ jid, sid })
      .then( data => setState(s=>({ ...s, ...data, fetched:true })) );
  }, [ jid, sid ])
  
  
  return (<MainContainer sidebar={<Sidebar selected="timeline" {...props} />}><Container maxWidth="md">
    <ContentHeader
      label="Timeline"
      breadcrumbs={[
        { label:"Home", to:`/` },
        { label:"Administrator" },
        { label:"Submission", to:`/${jid}/admin` },
      ]}
    />
    <TableContainer>
      <Divider />
      <Table size="small">
        <TableHead>
          <TableRow>
            <Cell width={'75%'}>Title</Cell>
            <Cell align="center">User</Cell>
            <Cell align="center">Date</Cell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          state.fetched
            ? state.timelines.map((doc,index)=>(<TableRow hover key={index}>
              <Cell>{ doc.title }</Cell>
              <Cell><Typography noWrap>{ state.users[ doc.user ] || doc.user }</Typography></Cell>
              <Cell><Typography noWrap>{ moment(doc.date).format("LLL") }</Typography></Cell>
            </TableRow>))
            : (<TableRow>
              <Cell><Skeleton width={"50%"} /></Cell>
              <Cell><Skeleton width={"50%"} /></Cell>
              <Cell><Skeleton width={"50%"} /></Cell>
            </TableRow>)
        }
        </TableBody>
      </Table>
    </TableContainer>
  </Container></MainContainer>)
}

export default PageTimeline;