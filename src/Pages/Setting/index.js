import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ProfileEditPage from './ProfileEdit';

const SettingPage = props => {
  return (<Switch>
    <Route path="/:jid/setting/profile-edit" component={ProfileEditPage} />
  </Switch>)
}

export default SettingPage;