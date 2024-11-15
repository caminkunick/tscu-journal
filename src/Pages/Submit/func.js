import { auth, db, dbTimestamp } from 'Modules/firebase';

export class Sender {
  constructor(jid,sid){
    this.jid = jid;
    this.sid = sid;

    this.submit = null;
    this.files = {};
    this.discuss = [];
    this.users = {};
  }
  // ======================================== OTHERS ========================================
  init = async () => {
    await this.getSubmit();
    await this.getFiles();
    await this.getDiscuss();
  }
  getPath = ({ jid, sid, did }) => {
    let path = db.collection('journals').doc(jid);

    if(sid){ path = path.collection('submits').doc(sid) }
    else if(did){ path = path.collection('discussions').doc(did) }

    return path;
  }
  getUID = () => auth.currentUser.uid;
  // ======================================== GET ========================================
  getSubmit = async () => {
    const query = await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).get();
    this.submit = query.data();
    return this.submit;
  }
  getFiles = async () => {
    const query = await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).collection("files").get();
    const files = query.docs.map(doc=>({ [doc.id]:{ ...doc.data(), id:doc.id } }));
    this.files = Object.assign({}, ...files);
    return this.files;
  }
  getDiscuss = async () => {
    const queryDiscuss = await db.collection('journals').doc(this.jid).collection('discussions').where('parent','==',this.sid).get();
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
  // ======================================== TITLE ========================================
  setTitle = async (lang,value) => {
    if(this.submit.step===0){
      let title = { ...this.submit.title };
      title[lang] = value;
      await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).update({ title, date:dbTimestamp() });
      return await this.getSubmit();
    }
    return this.submit;
  }
  addOtherTitle = async (lang,value) => {
    if(this.submit.step===0){
      let title = { ...this.submit.title };
      title.others.push({ lang, value });
      await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).update({ title, date:dbTimestamp() });
      return await this.getSubmit();
    }
    return this.submit;
  }
  setOtherTitle = async (index,value) => {
    if(this.submit.step===0){
      let title = { ...this.submit.title };
      title.others[index] = { ...title.others[index], value };
      await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).update({ title, date:dbTimestamp() });
      return await this.getSubmit();
    }
    return this.submit;
  }
  removeOtherTitle = async index => {
    if(this.submit.step===0){
      let title = { ...this.submit.title };
      title.others.splice(index,1);
      await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).update({ title, date:dbTimestamp() });
      return await this.getSubmit();
    }
    return this.submit;
  }
  // ======================================== DISCUSS ========================================
  getDiscussByGroup = group => {
    return this.discuss.filter(doc=>doc.group===group);
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
  // ======================================== FILES ========================================
  getFilesByGroup = group => {
    const filters = Object.values(this.files)
      .filter(file=>file.group===group)
      .map(file=>({ [file.id]:file }));
    return Object.assign({}, ...filters);
  }
  addFile = async (group,file) => {
    if(!group){ return { error:'variable-group-not-found', message:'variable "group" not found' } };
    await this.getPath({jid:this.jid,sid:this.sid}).collection('files').add({
      date: dbTimestamp(),
      user: this.submit.user,
      by: this.getUID(),
      ...file,
      group,
    })
    return await this.getFiles();
  }
}