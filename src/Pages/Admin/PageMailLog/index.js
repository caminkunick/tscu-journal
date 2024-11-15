import { Divider, List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import { Container, MainContainer } from "@piui";
import { useContext } from "react";
import Sidebar from "../Sidebar";
import { connectMailLog, MailLogContext } from "./context";

export const PageMailLog = connectMailLog((props) => {
  const { jid, ...store } = useContext(MailLogContext);
  const [state] = store.state;

  return (
    <MainContainer sidebar={<Sidebar jid={jid} selected="maillog" />}>
      <Container maxWidth="md">
        {state.fetched &&
          Object.keys(state.docs).map((sid) => {
            return (
              state.submits[sid].title && (
                <List
                  dense
                  key={sid}
                  subheader={
                    <ListSubheader>
                      {state.submits[sid].title.tha} | {sid}
                    </ListSubheader>
                  }
                  style={{marginBottom:32}}
                >
                  <Divider />
                  {state.docs[sid].map((doc) => (
                    <ListItem dense divider key={doc.key}>
                      <ListItemText
                        primary={`Pattern: ${doc.patternNumber}`}
                        secondary={`key: ${doc.key}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )
            );
          })}
      </Container>
    </MainContainer>
  );
});
