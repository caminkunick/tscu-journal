import { Skeleton } from '@material-ui/lab';
import React from 'react';

import TableReviewerAttach from './TableReviewerAttach';

const TabReview = ({ parentState, ...props }) => {
  const [ state ] = parentState;

  return state.fetched
    ? (
      state.submit.step>0
        ? (<React.Fragment>
          <TableReviewerAttach parentState={parentState} />
        </React.Fragment>)
        : <React.Fragment>Stage not initiated.</React.Fragment>
    )
    : <Skeleton width="30%" /> ;
}

export default TabReview;