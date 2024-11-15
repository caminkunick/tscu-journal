import { Box } from "@material-ui/core"
import { Discussion, Attachments } from "@piui";
import { useContext } from "react"
import { ObserveSubmitContext } from "../Context"

export const ContentCopyEditing = props => {
  const { getFiles, getDiscuss, ...store } = useContext(ObserveSubmitContext);
  const [state] = store.state;

  return (<>
    <Discussion
      label="Copyediting Discussions"
      docs={getDiscuss('copyediting')}
      users={state.users}
    />
    <Box mt={5} />
    <Attachments
      label="Copyedited"
      files={getFiles('copyedited')}
    />
  </>)
}