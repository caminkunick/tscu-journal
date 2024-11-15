import React from 'react';
import { MainContainer, Container, ContentHeader, Calendar } from '@piui';
import Sidebar from '../Sidebar';

import { db } from 'Modules/firebase';
import { Box, CircularProgress } from '@material-ui/core';

const getCurrentMonth = async (jid) => {
  const query = await db.collection('journals').doc(jid).collection('reviewers').get();
  const docs = query.docs
    .map(doc=>({ ...doc.data(), id:doc.id }))
    .map(async doc=>{
      if(doc.schedule){
        let Subject = "";
        const submitQuery = await db.collection('journals').doc(jid).collection('submits').doc(doc.parent).get();
        if(submitQuery.exists){
          Subject = submitQuery.data().title.eng;
          return {
            Id:doc.id,
            Subject,
            data:{ ...doc, jid },
            StartTime:new Date(doc.schedule.review.toMillis()),
            EndTime:new Date(doc.schedule.review.toMillis()),
            IsAllDay: true,
            color: '#f00',
          };
        } 
      }
      return null
    })
  const data = await Promise.all(docs);
  return data.filter(doc=>Boolean(doc));
}

const PageCalendar = props => {
  const { jid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    docs: [],
  })

  React.useEffect(()=>{
    getCurrentMonth(jid).then(docs=>setState(s=>({ ...s, docs, fetched:true })));
  }, [ jid ])

  return (<MainContainer sidebar={<Sidebar jid={jid} selected="calendar" />}>
    <Container maxWidth="md">
      <ContentHeader
        label="Calendar"
        breadcrumbs={[
          { label:"Home", to:`/${jid}` },
        ]}
      />
      {
        state.fetched
          ? <Calendar data={state.docs} />
          : <Box textAlign="center" children={<CircularProgress size={64} color="inherit" />} />
      }
    </Container>
  </MainContainer>)
}

export default PageCalendar;