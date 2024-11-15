import React from 'react';
import { Link } from 'react-router-dom';
import {
  MainContainer,
  Container,
  ContentHeader,
} from '@piui';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  withStyles,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { getJournalLists } from 'Method';


const ListItemLink = withStyles(theme=>({
  
}))(props=><ListItem component={Link} button divider {...props} />)


const HomePage = props => {
  const [ state, setState ] = React.useState({
    fetched: false,
    docs: [],
  })
  
  React.useEffect(()=>{
    return getJournalLists(docs=>setState(s=>({ ...s, fetched:true, docs })))
  }, []);
  
  return (<MainContainer>
    <Container maxWidth="sm">
      <ContentHeader label="Journal" />
      <List>
      <Divider />
      {
        state.fetched
          ? state.docs.map(doc=>(<ListItemLink key={doc.id} to={`/${doc.id}/`}>
            <ListItemText primary={doc.title} />
          </ListItemLink>))
          : (<ListItem divider>
            <ListItemText primary={<Skeleton width={`50%`} />} />
          </ListItem>)
      }
      </List>
    </Container>
  </MainContainer>)
}

export default HomePage;