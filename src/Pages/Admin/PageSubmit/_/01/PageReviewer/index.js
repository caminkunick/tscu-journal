import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PageHome from './Home';
import PageReviewer from './Reviewer';

const PageReviewers = props => {
    
    return (<Switch>
        <Route path="/:jid/admin/s/:sid/reviewer/:rid" component={PageReviewer} />
        <Route path="/:jid/admin/s/:sid/reviewer" component={PageHome} />
    </Switch>);
}

export default PageReviewers;