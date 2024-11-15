import { db } from 'Modules/firebase';
import getRole from './getRole';
import { getAuthorName } from './author';

const getPath = (jid,sid) => {
  let path = db.collection('journals').doc(jid);
  if(sid){
    path = path.collection('submits').doc(sid);
  }
  return path;
}

const getJournalLists = (callback) => db.collection('journals').onSnapshot(snap=>{
  callback(snap.docs.map(doc=>({ ...doc.data(), id:doc.id })));
})
const getJournalInfo = async (jid) => {
  return (await getPath(jid).get()).data();
}
const getMySubmission = (jid, uid, callback) => (dispatch,getState) => {
  if(uid){
    let data = {};
    const watchMySubmits = getPath(jid).collection('submits').where('user','==',uid).onSnapshot(snapshot=>{
      data.submissions = [];
      data.archives = [];
      snapshot.docs.forEach(snap=>{
        const doc = { ...snap.data(), id:snap.id };
        if(doc.step===3 || ["rejected","cancel"].includes(doc.status)){ data.archives.push(doc) }
        else { data.submissions.push(doc) }
      });
      callback(data);
    })
    const watchMyReviewers = getPath(jid).collection('reviewers').where('user','==',uid).onSnapshot(snapshot=>{
      data.reviewers = snapshot.docs.map(doc=>({ ...doc.data(), id:doc.id }));
      callback(data);
    })
    return ()=>{
      watchMySubmits();
      watchMyReviewers();
    }
  }
  return ()=>(false);
}
const sorting = (key,by="asc") => (a,b) => {
  if(key==='date'){
    let aDate = a.date ? a.date.toMillis() : Date.now();
    let bDate = b.date ? b.date.toMillis() : Date.now();

    if(by.toLocaleLowerCase()==='desc'){
      [ aDate, bDate ] = [ bDate, aDate ];
    }

    return aDate - bDate;
  }
  return true;
}

export {
  getJournalLists,
  getJournalInfo,
  getMySubmission,
  getRole,
  sorting,
  getAuthorName,
}