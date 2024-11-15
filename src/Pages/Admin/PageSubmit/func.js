import { auth, db, dbTimestamp } from 'Modules/firebase';
import { mailer, sendMail } from 'Method/mailer';

export class AdminSubmit {
  constructor(jid,sid){
    this.jid = jid;
    this.sid = sid;
    this.submit = {};
    this.files = [];
    this.discuss = [];
    this.users = {};
  }
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
  // ================================================== SUBMIT ==================================================
  getSubmit = async () => {
    const query = await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).get();
    this.submit = query.data();
    return this.submit;
  }
  setSubmit = async data => {
    await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).update({ ...data });
    if(data.status==='rejected'){
      const email = this.submit.authors[0].email;
      await mailer('Submission update status',email,`Your submission was rejected&nbsp;<a href="http://journal.phra.in/${this.jid}/s/id/${this.sid}">check here</a>`);
    } else if(data.status==='submitting') {
      const email = this.submit.authors[0].email;
      await mailer('Submission update status',email,`Your submission was unreject&nbsp;<a href="http://journal.phra.in/${this.jid}/s/id/${this.sid}">check here</a>`);
    } else if(data.step===1) {
      const email = this.submit.authors[0].email;
      await mailer('Submission update status',email,`Your submission change to Review state&nbsp;<a href="http://journal.phra.in/${this.jid}/s/id/${this.sid}">check here</a>`);
    } else if(data.step===2) {
      const email = this.submit.authors[0].email;
      await mailer('Submission update status',email,`Your submission change to Copyediting state&nbsp;<a href="http://journal.phra.in/${this.jid}/s/id/${this.sid}">check here</a>`);
    } else if(data.step===3) {
      const email = this.submit.authors[0].email;
      await mailer('Submission update status',email,`Your submission change to Production state&nbsp;<a href="http://journal.phra.in/${this.jid}/s/id/${this.sid}">check here</a>`);
    }
    return await this.getSubmit();
  }
  // ================================================== FILE ==================================================
  getFiles = async () => {
    const query = await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).collection('files').get();
    this.files = query.docs.map(doc=>({ ...doc.data(), id:doc.id }))
    return this.files;
  }
  getFilesByGroup = group => {
    const filters = this.files.filter(file=>file.group===group).map(file=>({ [file.id]:file }));
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
  // ================================================== DISCUSSION ==================================================
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
  setReviewerCommentDate = async () => {
    const path = db.collection('journals').doc(this.jid).collection('submits').doc(this.sid);
    return await path.update({ reviewerCommentDate:dbTimestamp() });
  }
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
    await sendMail('15', this.jid, this.sid);
    
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

    await sendMail('15', this.jid, this.sid);

    return await this.getDiscuss();
  }
}