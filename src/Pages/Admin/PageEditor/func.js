import { db } from 'Modules/firebase';

const getEditor = async jid => {
  const path = db.collection('journals').doc(jid).collection('users');
  const query = await path.get();
  const editors = query.docs
    .map(doc=>({ ...doc.data(), uid:doc.id }))
    .filter((s,i,a)=>Boolean(s.editor));
  const users = query.docs
    .map(doc=>({ ...doc.data(), uid:doc.id, }))
    .map(doc=>({ ...doc, ...(doc.info || {}) }));
  return { editors, users };
}


const addEditor = async ({ jid, uid }) => {
  const path = db.collection('journals').doc(jid).collection('users');
  return await path.doc(uid).update({ editor:true });
}


const removeEditor = async ({ jid, uid }) => {
  const path = db.collection('journals').doc(jid).collection('users');
  return await path.doc(uid).update({ editor:null });
}


export {
  getEditor,
  addEditor,
  removeEditor,
}