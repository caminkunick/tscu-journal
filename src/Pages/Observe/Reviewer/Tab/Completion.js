import { Discussion } from "@piui"
import { useContext } from "react"
import { ObserveReviewerContext } from "../Context"

export const TabCompletion = props => {
  const { getDiscuss, ...store } = useContext(ObserveReviewerContext);
  const [state] = store.state;

  return (<>
    <Discussion
      label="Review Discussions"
      fetched={true}
      docs={getDiscuss('completion')}
      users={state.users}
    />
  </>)
} 