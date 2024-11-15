import { auth, db, dbTimestamp } from 'Modules/firebase';

function AdminSubmission(jid,sid){
  let submit = {};
  // ======================================== OTHER FUNCTIONS ========================================
  const getPath = ({ jid, sid, did }) => {
    let path = db.collection('journals').doc(jid);

    if(sid){ path = path.collection('submits').doc(sid) }
    else if(did){ path = path.collection('discussions').doc(did) }

    return path;
  }
  const getUID = () => auth.currentUser.uid;


  // ======================================== GET SUBMISSION ========================================
  const get = async () => {
    const snapshot = await getPath({jid,sid}).get();
    submit = snapshot.data();
    return submit;
  }
  const setStep = async (data) => await getPath({jid,sid}).update({ ...data, date:dbTimestamp() });

  // ======================================== ATTACHMENT ========================================
  const getAttachment = async (group) => {
    if(!group){ return { error:'variable-group-not-found', message:'variable "group" not found' } };
    const snapshot = await getPath({jid,sid})
    .collection('files')
    .where('group','==',group)
    .get();
    const files = Object.assign({}, ...snapshot.docs.map(doc=>({
      [doc.id]: doc.data(),
    })));
    return { files };
  }
  const addAttachment = async (group, file) => {
    if(!group){ return { error:'variable-group-not-found', message:'variable "group" not found' } };
    await getPath({jid,sid}).collection('files').add({
      date: dbTimestamp(),
      user: getUID(),
      by: getUID(),
      ...file,
      group,
    })
    return await getAttachment(group);
  }

  // ======================================== DISCUSSION ========================================
  const getDiscuss = async (group) => {
    const path = db.collection('journals').doc(jid).collection('discussions');
    
    const snapshotDocs = await path
      .where("group","==",group)
      .where("parent","==",sid)
      .get();
    const promDocs = snapshotDocs.docs
      .map(async doc=>{
        const queryMessages = await path.doc(doc.id).collection('messages').get();
        const messages = queryMessages.docs.map(doc=>({ ...doc.data(), id:doc.id }));
        return { ...doc.data(), id:doc.id, messages };
      });
    const docs = await Promise.all(promDocs);
    
    const snapshotUsers = docs
      .map(doc=>doc.user)
      .filter((s,i,a)=>a.indexOf(s)===i)
      .map(async uid=>{
        const user = await db.collection('journals').doc(jid).collection('users').doc(uid).get();
        const { info } = user.data() || {};
        const displayName = info ? info.tha.fname : uid ;
        return { [uid]:displayName }
      })
    const users = Object.assign({}, ...(await Promise.all(snapshotUsers)));
    
    return { docs, users };
  }
  const addDiscuss = async (group, discuss) => {
    const { files, message, ...other } = discuss;
    const path = db.collection('journals').doc(jid).collection('discussions');
    
    const discussData = {
      date: dbTimestamp(),
      user: discuss.user || getUID(),
      by: getUID(),
      group,
      parent: sid,
      ...other,
    }
    const discussSnapshot = await path.add(discussData);
    
    const messageData = {
      date: dbTimestamp(),
      files,
      message,
      user: discuss.user || getUID(),
      by: getUID(),
    }
    await path.doc(discussSnapshot.id).collection('messages').add(messageData);
    return await getDiscuss(group);
  }
  const addMessage = async (did, group, message) => {
    const path = db.collection('journals').doc(jid).collection('discussions');
    const messageData = {
      date: dbTimestamp(),
      user: message.user || getUID(),
      by: getUID(),
      ...message,
    }
    await path.doc(did).collection('messages').add(messageData);
    return await getDiscuss(group);
  }

  return {
    submit,
    get,
    setStep,

    getAttachment,
    addAttachment,

    getDiscuss,
    addDiscuss,
    addMessage,
  };
}

export default AdminSubmission;