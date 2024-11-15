import { combineReducers } from 'redux'
import user from './user';
import alerts from './alerts';

export default combineReducers({
  user,
  alerts,
})