import { db } from 'Modules/firebase';

export const getSenderDiscussions = async (jid,sid,step=0) => {
  if(jid && sid){
    const query = await db.collection('journals').doc(jid)
      .collection('submits').doc(sid)
      .collection('discussions')
      .where('step','==',step)
      .get();
    
    let asyncDocs = query.docs.map(async doc=>{
      const queryMessages = await db.collection('journals').doc(jid)
        .collection('submits').doc(sid)
        .collection('discussions').doc(doc.id)
        .collection('messages').get();
      const messages = queryMessages.docs.map(msg=>({ ...msg.data(), id:msg.id }));
      return { ...doc.data(), id:doc.id, messages };
    });
    const docs = await Promise.all(asyncDocs);
      
    const asyncUsers = await Promise.all(
      docs.map(doc=>doc.user)
        .filter((s,i,a)=>a.indexOf(s)===i)
        .map(async uid=>({
          uid,
          ...(await db.collection('journals').doc(jid).collection("users").doc(uid).get()).data(),
        }))
        .map(async doc=>{
          const currentDoc = await doc;
          return { uid:currentDoc.uid, displayName:currentDoc.info.eng.fname };
        })
    );
    const users = Object.assign({}, ...asyncUsers.map(user=>({ [user.uid]:user.displayName })));
    
    return { docs, users };
  }
  return {};
};