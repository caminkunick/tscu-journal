import { auth, db, dbTimestamp } from 'Modules/firebase';

export const getSubmissionFilesById = async (jid,sid,step) => {
  const path = db.collection('journals').doc(jid).collection('submits').doc(sid);
  const qfiles = await path.collection('files')
    .where('step','==',step)
    .where('visibility','==','visible')
    .get();
  const files = qfiles.docs
    .map(doc=>({ ...doc.data(), id:doc.id }))
    .sort((a,b)=>{
      const adate = a.date ? a.date.toMillis() : Date.now();
      const bdate = b.date ? a.date.toMillis() : Date.now();
      return bdate-adate;
    });
  return files;
}
export const getSubmissionById = async (jid,sid) => {
  const path = db.collection('journals').doc(jid).collection('submits').doc(sid);
  
  const query = await path.get();
  const submit = query.data();
  
  return { submit };
}

export const addSubmissionFile = async (jid,sid,step,data) => {
  if(jid && sid && data){
    const path = db.collection('journals').doc(jid).collection('submits').doc(sid);
    await path.collection('files').add({
      ...data,
      step,
      date: dbTimestamp(),
      by: auth.currentUser.uid,
      parent: 0,
      visibility: "visible",
    });

    return await getSubmissionFilesById(jid,sid,step);
  }
  return false;
}

export const getSubmissionDiscussionById = async (jid,sid,step) => {
  if(jid && sid){
    const snapshot = await db.collection('journals').doc(jid)
      .collection('discussions')
      .where('parent','==',sid)
      .where('step','==',step)
      .get();
    
    const asyncDocs = snapshot.docs
      .map(doc=>({ ...doc.data(), id:doc.id }))
      .map(async doc=> {
        const qMsg = await db.collection('journals').doc(jid).collection('discussions').doc(doc.id).collection('messages').get();
        const messages = qMsg.docs
          .map(doc=>({ ...doc.data(), id:doc.id }));
        return { ...doc, messages };
      });
    const docs = await Promise.all(asyncDocs);

    const asyncUsers = docs
      .map(doc=>doc.user)
      .filter((s,i,a)=>a.indexOf(s)===i)
      .map(async uid=>{
        const queryUser = await db.collection('journals').doc(jid).collection('users').doc(uid).get();
        const { info } = queryUser.data() || {};
        return { [uid]: info ? info.eng.fname : uid };
      });
    const users = Object.assign({}, ...(await Promise.all(asyncUsers)));
    
    return { docs, users };
  }
  return {};
}

export const addDiscussion = async (jid,sid,step,data) => {
  if(jid && sid){
    let { files, message, ...discussData } = data;
    discussData = {
      step,
      parent: sid,
      by: auth.currentUser.uid,
      user: auth.currentUser.uid,
      date: dbTimestamp(),
      ...discussData,
    };
    let messageData = {
      files,
      message,
      date: dbTimestamp(),
      user: data.user || auth.currentUser.uid,
      by: auth.currentUser.uid,
    }

    const discussAddResult = await db.collection('journals').doc(jid).collection('discussions').add(discussData);

    await db.collection('journals').doc(jid).collection('discussions').doc(discussAddResult.id).collection('messages').add(messageData);

    return await getSubmissionDiscussionById(jid,sid,step);
  }
}

export const addMessage = async (jid, sid, did, step, data) => {
  let messageData = {
    date: dbTimestamp(),
    user: data.user || auth.currentUser.uid,
    by: auth.currentUser.uid,
    ...data,
  }

  await db.collection('journals').doc(jid).collection('discussions').doc(did).collection('messages').add(messageData);
  return await getSubmissionDiscussionById(jid,sid,step);
}