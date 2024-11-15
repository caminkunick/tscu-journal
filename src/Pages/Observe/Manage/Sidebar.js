import { Divider } from "@material-ui/core";
import { BackLink, UserMenuList } from "@piui"
import { useContext } from "react"
import { ObserveSubmit } from "./Context"

export const Sidebar = ({ selected="submit", ...props }) => {
  const { jid } = useContext(ObserveSubmit);

  return (<>
    <BackLink to={`/${jid}/select-role/`} />
    <UserMenuList jid={jid} />
    <Divider />
  </>)
}