import { ListItem, ListItemText } from "@material-ui/core";
import { useContext } from "react";
import { connectObserveSubmit, ObserveSubmit } from "./Context";
import { Sidebar } from "./Sidebar";
import moment from 'moment';
import { Link } from "react-router-dom";

const { MainContainer, Container, ContentHeader, ListDocs } = require("@piui");

const getStrDate = date => {
  const millis = date.toMillis ? date.toMillis() : Date.now();
  return moment(millis).format('LL เวลา LT');
}

const PageObserveSubmit = props => {
  const { jid, ...store } = useContext(ObserveSubmit);
  const [state] = store.state; 

  return (<MainContainer signInOnly sidebar={<Sidebar />}>
    <Container maxWidth="md">
      <ContentHeader
        label="Submit"
        breadcrumbs={[
          {label:`Home`,to:`/`},
          {label:`Observe`},
        ]}
      />
      <ListDocs
        fetched={state.fetched}
        docs={state.docs}
        component={(doc,index)=>(<ListItem dense divider button key={doc.id} component={Link} to={`/${jid}/observe/s/${doc.id}`}>
          <ListItemText
            primary={doc.title.tha}
            secondary={getStrDate(doc.date)}
            primaryTypographyProps={{color:"primary"}}
            secondaryTypographyProps={{variant:"caption"}}
          />
        </ListItem>)}
      />
    </Container>
  </MainContainer>)
}

export default connectObserveSubmit(PageObserveSubmit);