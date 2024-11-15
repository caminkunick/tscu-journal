import { Box } from "@material-ui/core";
import { Attachments, Discussion } from "@piui"
import { useContext } from "react"
import { ObserveSubmitContext } from "../Context"

export const ContentProduction = props => {
  const { getFiles, getDiscuss, ...store } = useContext(ObserveSubmitContext);
  const [state] = store.state;

  return (<>
    <Discussion
      label="Production Discussions"
      docs={getDiscuss('production')}
      users={state.users}
    />
    <Box mt={5} />
    <Attachments
      label="Galleys"
      files={getFiles('production')}
    />
  </>)
}