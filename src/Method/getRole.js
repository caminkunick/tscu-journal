import { db } from 'Modules/firebase';

const getRole = (jid) => async (dispatch,getState) => {
  const user = getState().user.data;
  if(user){
    const query = await db.collection('journals').doc(jid).collection('users').doc(user.uid).get();
    const { role } = query.data() || { role:'user' };
    return role;
  }
  return 'user';
}

export default getRole;