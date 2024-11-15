import { Box } from "@material-ui/core";
import { Attachments, Discussion } from "@piui"
import { useContext } from "react"
import { ObserveSubmitContext } from "../Context"

export const ContentReview = props => {
  const { getFiles, getDiscuss, ...store } = useContext(ObserveSubmitContext);
  const [state] = store.state;

  return (<>
    <Attachments
      label="Reviewer's Comments"
      files={getFiles('reviewer-attach')}
    />
    <Box mt={5} />
    <Attachments
      label="Revisions"
      files={getFiles('revisions')}
    />
    <Box mt={5} />
    <Discussion
      label="Review Discussions"
      docs={getDiscuss('review')}
      users={state.users}
    />
  </>)
}