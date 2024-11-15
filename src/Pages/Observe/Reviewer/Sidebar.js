import { Divider } from "@material-ui/core";
import { BackLink, UserMenuList } from "@piui";
import { useContext } from "react"
import { ObserveReviewerContext } from "./Context"

export const Sidebar = props => {
  const { jid, sid } = useContext(ObserveReviewerContext);
  
  return (<>
    <BackLink to={`/${jid}/observe/s/${sid}`} />
    <UserMenuList jid={jid} />
    <Divider />
  </>)
}