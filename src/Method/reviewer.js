import { firebase, auth, db, dbTimestamp } from 'Modules/firebase';
import moment from 'moment';

export class Reviewer {
  constructor(){
    this.jid = "";
    this.rid = "";
    this.sid = "";

    this.request = {};
    this.submit = {}
    this.files = {};
    this.discuss = [];
  }
  init = async (jid,rid) => {
    this.jid = jid;
    this.rid = rid;

    await this.getReviewer();
    await this.getSubmit();
    await this.getFiles();
    await this.getDiscuss();
  }
  complete = async () => {
    await this.getPath('reviewer').update({
      step: 2,
      status: 'complete',
    })
    this.request  = await this.getReviewer();
    return this.request;
  }
  getPath = (path) => {
    const journal = db.collection('journals').doc(this.jid);
    switch(path){
      case 'reviewer':
        return journal.collection('reviewers').doc(this.rid);
      case 'submit':
        return journal.collection('submits').doc(this.sid);
      default:
        return journal;
    }
  }
  getUID = () => auth.currentUser.uid;
  // ======================================== REVIEWER ========================================
  getReviewer = async () => {
    const query = await this.getPath('reviewer').get();
    this.request = query.data();
    this.sid = this.request.parent;
    return this.request;
  }
  sendRequest = async (schedule) => {
    let newSchedule = {};
    Object.keys(schedule).forEach(key=>{
      const date = new Date(schedule[key]);
      newSchedule[key] = firebase.firestore.Timestamp.fromDate(date)
    })
    await this.getPath('reviewer').update({
      schedule: newSchedule,
      step: 1,
      status: 'requesting',
    })
    return await this.getReviewer();
  }
  // ======================================== SUBMIT ========================================
  getSubmit = async () => {
    const query = await this.getPath('submit').get();
    this.submit = query.data();
    return this.submit;
  }
  // ======================================== TIME ========================================
  dateToStr = (date) => {
    const epoch = date.toMillis ? date.toMillis() : date;
    return moment(epoch).format('YYYY-MM-DD');
  }
  // ======================================== FILES ========================================
  addFile = async (group,file) => {
    if(!group){ return { error:'variable-group-not-found', message:'variable "group" not found' } };
    await this.getPath('reviewer').collection('files').add({
      date: dbTimestamp(),
      user: this.getUID(),
      by: this.getUID(),
      ...file,
      group,
    })
    return await this.getFiles();
  }
  getFiles = async () => {
    const query = await this.getPath("reviewer").collection('files').get();
    this.files = query.docs.map(doc=>({ ...doc.data(), id:doc.id }));
    return this.files;
  }
  getFilesByGroup = group => {
    const filters = this.files.filter(file=>file.group===group).map(file=>({ [file.id]:file }));
    return Object.assign({}, ...filters)
  }
  // ======================================== DISCUSSION ========================================
  getDiscuss = async () => {
    const queryDiscuss = await db.collection('journals').doc(this.jid).collection('discussions').where('parent','==',this.rid).get();
    const asyncDiscuss = queryDiscuss.docs
      .map(async doc=>{
        const messagesQuery = await db.collection('journals').doc(this.jid).collection('discussions').doc(doc.id).collection('messages').get();
        const messages = messagesQuery.docs.map(doc=>({ ...doc.data(), id:doc.id }));
        return { ...doc.data(), id:doc.id, messages };
      });
    this.discuss = await Promise.all(asyncDiscuss);
    
    const asyncUsers = this.discuss
      .map(dc=>dc.user)
      .filter((s,i,a)=>a.indexOf(s)===i)
      .map(async uid=>{
        const userQuery = await db.collection('journals').doc(this.jid).collection('users').doc(uid).get();
        const { info } = userQuery.data();
        return { [uid]:(info ? info.tha.fname : uid) }
      });
    this.users = Object.assign({}, ...(await Promise.all(asyncUsers)));
    
    return this.discuss;
  }
  getDiscussByGroup = group => {
    return this.discuss.filter(d=>d.group===group);
  }
  addDiscuss = async (group, discuss) => {
    const { files, message, ...other } = discuss;
    const path = db.collection('journals').doc(this.jid).collection('discussions');
    
    const discussData = {
      date: dbTimestamp(),
      user: discuss.user || this.getUID(),
      by: this.getUID(),
      group,
      parent: this.rid,
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
    return await this.getDiscuss();
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
    return await this.getDiscuss();
  }
  // ======================================== OTHERS ========================================
  testFunc = () => {
    console.log(test)
    /*
    this.submit.title.tha = "test";
    console.log(this.submit)
    this.update(u=>({ ...u, ...this }));
    */
  }
  removeInvitation = async () => {
    await db.collection('journals').doc(this.jid).collection('reviewers').doc(this.rid).delete();
  }
}