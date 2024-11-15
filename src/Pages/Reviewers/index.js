import React from 'react';
import { Link as RLink } from 'react-router-dom';
import { MainContainer, Container, ContentHeader, Table, Row, Cell, BackLink, UserMenuList } from '@piui';
import { auth, db } from 'Modules/firebase';
import { Skeleton } from '@material-ui/lab';
import { Link, Typography } from '@material-ui/core';
import moment from 'moment';

const getReviewRequest = async (jid) => {
  const uid = auth.currentUser.uid;
  const path = db.collection("journals").doc(jid).collection('reviewers').where('user','==',uid);
  const query = await path.get();
  const promDocs = query.docs
    .filter(doc=>doc.data().step>0)
    .map(async doc=>{
      const querysubmit = await db.collection('journals').doc(jid).collection('submits').doc(doc.data().parent).get();
      const { title } = querysubmit.data() || {};
      return { ...doc.data(), id:doc.id, title };
    });
  const docs = await Promise.all(promDocs);
  return { docs };
}

const Reviewer = props => {
  const { jid, sid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    docs: [],
  })

  const Sidebar = props => (<React.Fragment>
    <BackLink to={`/${jid}/select-role/`} />
    <UserMenuList jid={jid} role="Reviewer" />
  </React.Fragment>)

  React.useEffect(()=>{
    getReviewRequest(jid).then(data=>setState(s=>({ ...s, ...data, fetched:true })));
  }, [ jid, sid ])

  return (<MainContainer sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label="Review Request"
        breadcrumbs={[
          { label:"Home", to:`/${jid}/` },
          { label:"My Submission", to:`/${jid}/s` },
        ]}
      />
      <Table
        head={<Row>
          <Cell width="100%">Title</Cell>
          <Cell align="center">Date</Cell>
        </Row>}
      >
        {
          state.fetched
            ? (
              state.docs.length
                ? state.docs.map(doc=>(<Row key={doc.id}>
                  <Cell>
                    <Link component={RLink} to={`/${jid}/r/${doc.id}`}>{ doc.title.tha }</Link>
                  </Cell>
                  <Cell>
                    <Typography noWrap variant="caption">{ moment(doc.date.toMillis()).format("L LT") }</Typography>
                  </Cell>
                </Row>))
                : (<Row><Cell colSpan={10}><Typography variant="caption" color="textSecondary">no request</Typography></Cell></Row>)
            )
            : (<Row><Cell colSpan={10}><Skeleton width="30%" /></Cell></Row>)
        }
      </Table>
    </Container>
  </MainContainer>);
}

export default Reviewer;