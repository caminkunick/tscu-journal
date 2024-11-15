import React from 'react';
import { MainContainer, Container, ContentHeader } from '@piui';
import { getSubmission } from './func';
import {
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Cell, Row } from './Row';
import Sidebar from '../Sidebar';

const PageHome = props => {
  const { jid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    docs: [],
  })
  
  React.useEffect(()=>{
    getSubmission(jid)
      .then(docs=>setState(s=>({ ...s, docs, fetched:true })));
  }, [ jid ])
  
  return (<MainContainer sidebar={<Sidebar jid={jid} />}>
    <Container maxWidth="md">
      <ContentHeader
        label="Submission"
        breadcrumbs={[
          { label:'Home', to:`/` },
          { label:'Administrator' },
        ]}
      />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <Cell padding="checkbox">
                <Checkbox />
              </Cell>
              <Cell width="100%">Title</Cell>
              <Cell>Status</Cell>
              <Cell>Date</Cell>
              <Cell>Sender</Cell>
            </TableRow>
          </TableHead>
          <TableBody>
          {
            state.fetched
              ? (
                state.docs.length
                  ? state.docs
                    .sort((a,b)=>{
                      const getDate = date => date ? date.toMillis() : Date.now();
                      return getDate(b.data().date) - getDate(a.data().date);
                    })
                    .map((doc)=><Row key={doc.id} jid={jid} doc={doc} />)
                  : (<TableRow>
                    <Cell colSpan={10}>
                      <Typography color="textSecondary">no submission</Typography>
                    </Cell>
                  </TableRow>)
              )
              : (<TableRow>
                <Cell colSpan={10}><Skeleton width={240} /></Cell>
              </TableRow>)
          }
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  </MainContainer>)
}

export default PageHome;