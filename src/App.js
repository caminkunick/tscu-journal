import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { auth } from 'Modules/firebase';
import {
  Loading,
} from '@piui';

import HomePage from 'Pages/Home';
import JournalPage from 'Pages/Journal';
import SelectRolePage from 'Pages/SelectRole';
import Submission from 'Pages/Submission';
import SubmitPage from 'Pages/Submit';
import Reviewers from 'Pages/Reviewers';
import Reviewer from 'Pages/Reviewer';
import MailPage from 'Pages/Mail';

import AdminPage from 'Pages/Admin';

import { PageObserve } from 'Pages/Observe/';

import SettingPage from 'Pages/Setting';
import PagePasswordReset from 'Pages/PasswordReset';

const App = ({ user, dispatch, ...props }) => {

  React.useEffect(() => {
    auth.onAuthStateChanged(data => dispatch({ type: 'USER_SET', data }));
  }, [dispatch])

  return user.fetched
    ? (<BrowserRouter>
      <Switch>
        <Route path="/:jid/observe/" component={PageObserve} />
        <Route path="/reset-password/" component={PagePasswordReset} />
        <Route path="/mail/:jid?/:id?/:role?/:type?" component={MailPage} />
        <Route path="/:jid/admin" component={AdminPage} />
        <Route path="/:jid/r/:rid" component={Reviewer} />
        <Route path="/:jid/r/" component={Reviewers} />
        <Route path="/:jid/s/id/:sid" component={SubmitPage} />
        <Route path="/:jid/s/:page?" component={Submission} />
        <Route path="/:jid/select-role/" component={SelectRolePage} />
        <Route path="/:jid/setting/" component={SettingPage} />
        <Route path="/:jid/" component={JournalPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </BrowserRouter>)
    : <Loading />;
}

export default connect(s => ({
  user: s.user,
}))(App);
