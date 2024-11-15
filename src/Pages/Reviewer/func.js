import { auth, db, dbTimestamp } from 'Modules/firebase';

export default class ReviewObject {
  constructor(jid, rid){
    this.jid = jid;
    this.rid = rid;
    this.request = {
      title: { tha:"", eng:"", others:[] },
      step: 0,
    };
    this.files = {};
    this.discuss = [];
    this.users = {};
  }
  // ======================================== OTHERS ========================================
  init = async () => {
    await this.get();
    await this.getFiles();
    await this.getDiscuss();
  }
  getUID = () => auth.currentUser.uid;
  saveRequest = async (accept,acceptSpecify) => {
    await db.collection('journals').doc(this.jid).collection('reviewers').doc(this.rid).update({ accept, acceptSpecify });
    return await this.get();
  }
  saveComment = async comment => {
    await db.collection('journals').doc(this.jid).collection('reviewers').doc(this.rid).update({ comment });
    return await this.get();
  }
  IsReviewerReviewed = () => Boolean(this.request.comment) || this.files.filter(file=>file.group==='review-upload').length>0;
  // ======================================== GET ========================================
  get = async () => {
    const queryRequest = await db.collection('journals').doc(this.jid).collection('reviewers').doc(this.rid).get();
    const request = queryRequest.data();
    
    const querySubmit = await db.collection('journals').doc(this.jid).collection('submits').doc(request.parent).get();
    const { title } = querySubmit.data() || {};
    
    this.request = { ...request, title }
    
    return this.request;
  }
  getFiles = async () => {
    const queryFiles = await db.collection('journals').doc(this.jid).collection('reviewers').doc(this.rid).collection('files').get();
    this.files = queryFiles.docs.map(doc=>({ ...doc.data(), id:doc.id }))
    
    return this.files;
  }
  addFile = async (group,file) => {
    if(!group){ return { error:'variable-group-not-found', message:'variable "group" not found' } };
    await db.collection('journals').doc(this.jid).collection('reviewers').doc(this.rid).collection('files').add({
      date: dbTimestamp(),
      user: this.getUID(),
      ...file,
      group,
    })
    return await this.getFiles();
  }
  getDiscuss = async () => {
    const path = db.collection('journals').doc(this.jid).collection('discussions');
    
    const snapshotDocs = await path
      .where("parent","==",this.rid)
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
  // ======================================== FILE ========================================
  getFilesByGroup = (group) => {
    const filters = this.files.filter(file=>file.group===group);
    const files = Object.assign({}, ...filters.map(file=>({ [file.id]:file })));
    return files;
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