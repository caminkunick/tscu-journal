import { firebase, db, dbTimestamp, auth } from 'Modules/firebase';
import { mailer } from 'Method/mailer';

class adminReviewer {
  constructor(jid, sid, rid){
    this.jid = jid;
    this.sid = sid;
    this.rid = rid;
    this.submit = null;
    this.request = null;
    this.files = {};
    this.discuss = [];
    this.users = {};
    this.pathSubmit = db.collection('journals').doc(this.jid).collection('submits').doc(this.sid);
    this.pathReviewer = db.collection('journals').doc(this.jid).collection('reviewers').doc(this.rid);
  }
  init = async () => {
    await this.getSubmit();
    await this.getRequest();
    await this.getFiles();
    await this.getDiscuss();
  }
  // ======================================== GET ========================================
  getSubmit = async () => {
    const query = await this.pathSubmit.get();
    this.submit = query.data();
    return this.submit;
  }
  getRequest = async () => {
    const query = await this.pathReviewer.get();
    this.request = query.data();
    return this.request
  }
  getFiles = async () => {
    const query = await this.pathReviewer.collection('files').get();
    this.files = Object.assign({}, ...query.docs.map(doc=>({ [doc.id]:{ ...doc.data(), id:doc.id } })));
    return this.files;
  }
  getDiscuss = async () => {
    const path = db.collection('journals').doc(this.jid).collection('discussions');
    
    const snapshotDocs = await path
      .where("parent","==",this.sid)
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
        const user = await db.collection('journals').doc(this.jid).collection('users').doc(uid).get();
        const { info } = user.data() || {};
        const displayName = info ? info.tha.fname : uid ;
        return { [uid]:displayName }
      })
    this.discuss = docs;
    this.users = Object.assign({}, ...(await Promise.all(snapshotUsers)));
    
    return docs;
  }
  getUID = () => auth.currentUser.uid;
  // ======================================== REQUEST ========================================
  sendRequest = async (schedule) => {
    let newSchedule = {};
    Object.keys(schedule).forEach(key=>{
      const date = new Date(schedule[key]);
      newSchedule[key] = firebase.firestore.Timestamp.fromDate(date)
    })
    await this.pathReviewer.update({
      schedule: newSchedule,
      step: 1,
      status: 'requesting',
    })
    const request = await this.getRequest();
    return { request };
  }
  // ======================================== REQUEST ========================================
  complete = async () => {
    await this.pathReviewer.update({
      step: 2,
      status: 'complete',
    })
    const request = await this.getRequest();
    return { request };
  }
  // ======================================== FILE ========================================
  getFilesByGroup = group => {
    const filter = Object.values(this.files).filter(file=>file.group===group);
    return Object.assign({}, ...filter.map(file=>({ [file.id]:file })));
  }
  addFile = async (group, file) => {
    await this.pathReviewer.collection('files').add({
      ...file,
      group,
      user: this.getUID(),
      date: dbTimestamp(),
    })
    const files = await this.getFiles();
    this.files = files;
    return { files };
  }
  // ======================================== DISCUSSION ========================================
  getDiscussByGroup = group => {
    const filter = this.discuss.filter(file=>file.group===group);
    return filter;
  }
  addDiscuss = async (group, discuss) => {
    const { files, message, ...other } = discuss;
    const path = db.collection('journals').doc(this.jid).collection('discussions');
    
    const discussData = {
      date: dbTimestamp(),
      user: discuss.user || this.getUID(),
      by: this.getUID(),
      group,
      parent: this.sid,
      ...other,
    }
    const discussSnapshot = await path.add(discussData);
    
    const messageData = {
      date: dbTimestamp(),
      files,
      message,
      user: discuss.user || this.getUID(),
      by: this.getUID(),
    }
    await path.doc(discussSnapshot.id).collection('messages').add(messageData);
    return { discuss:await this.getDiscuss(group) };
  }
  addMessage = async (did, group, message) => {
    const path = db.collection('journals').doc(this.jid).collection('discussions');
    const messageData = {
      date: dbTimestamp(),
      user: message.user || this.getUID(),
      by: this.getUID(),
      ...message,
    }
    await path.doc(did).collection('messages').add(messageData);
    return { discuss:await this.getDiscuss(group) };
  }
}

export default adminReviewer;