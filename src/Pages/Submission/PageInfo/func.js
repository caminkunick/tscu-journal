import { db } from 'Modules/firebase';

const getUserInfo = jid => async (dispatch,getState) => {
  const user = getState().user.data;
  if(user){
    const path = db.collection('journals').doc(jid).collection('users').doc(user.uid);
    const query = await path.get();
    if(query.exists){
      const data = query.data() || {};
      if(data.info){
        return true;
      }
    }
  }
  return false
}

export {
  getUserInfo,
}