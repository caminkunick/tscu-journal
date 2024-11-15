import { Divider, List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { BackLink, ListItemLink, UserMenuList } from "@piui";
import { getAuthorName } from "Method";
import { useContext } from "react";
import { ObserveSubmitContext } from './Context';

export const Sidebar = props => {
  const { jid, sid, ...store } = useContext(ObserveSubmitContext);
  const [state] = store.state;

  return (<>
    <BackLink to={`/${jid}/observe/`} />
    <UserMenuList jid={jid} />
    <Divider />
    <List subheader={<ListSubheader>Reviewer</ListSubheader>}>
      {
        state.fetched
          ? (
            state.reviewers.length
              ? state.reviewers.map(reviewer=>{
                const user = state.users[reviewer.user];
                return (user && user.info) && (<ListItemLink to={`/${jid}/observe/s/${sid}/r/${reviewer.id}`} key={reviewer.id}>
                  <ListItemText primary={getAuthorName(user.info.tha)} />
                </ListItemLink>)
              })
              : (<ListItem dense><ListItemText primary="no reviewer" primaryTypographyProps={{color:'textSecondary'}} /></ListItem>)
          )
          : (<ListItem dense><ListItemText primary={<Skeleton width="50%" />} /></ListItem>)
      }
    </List>
    <Divider />
  </>)
}