import { db } from "Modules/firebase";
import { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";

class ObserveReviewerController {
  constructor(jid,sid,rid) {
    this.jid = jid;
    this.sid = sid;
    this.rid = rid;
  }
  get = async () => {
    const path = await db.collection('journals').doc(this.jid);
    const submit = (await path.collection('submits').doc(this.sid).get()).data();
    const reviewer = (await path.collection('reviewers').doc(this.rid).get()).data();
    const files = (await path.collection('reviewers').doc(this.rid).collection('files').get())
      .docs.map(file=>({ ...file.data(), id:file.id }));
    const users = Object.assign({}, ...(await path.collection('users').get())
      .docs.map(user=>({ [user.id]:{...user.data(),id:user.id} })));
    const discuss = (await path.collection('discussions').where("parent","==",this.rid).get()).docs.map(d=>({ ...d.data(), id:d.id }));
    return { submit, reviewer, files, users, discuss };
  }
} 

export const ObserveReviewerContext = createContext({});

const defaultState = {
  fetched: false,
  submit: null,
  tab: 0,
  files: [],
  users: {},
  discuss: [],
};
const ObserveReviewerProvider = connect(s => ({ user: s.user.data }))(({ children, user, ...props }) => {
  const { jid, sid, rid } = props.match.params;
  const [Controller] = useState(new ObserveReviewerController(jid, sid, rid));
  const [state,setState] = useState({ ...defaultState })

  const store = {
    ...props,
    ...props.match.params,
    user,
    Controller,
    state: [state,setState],
    getFiles: group => Object.assign({}, ...state.files.filter(file=>file.group===group).map(file=>({ [file.id]:file }))),
    getDiscuss: group => state.discuss.filter(discuss=>discuss.group===group),
  }

  useEffect(()=>{
    Controller.get().then(results=>setState(s=>({ ...s, ...results, fetched:true })));
  }, [ jid, sid, rid, Controller ])

  return (<ObserveReviewerContext.Provider value={store}>
    {children}
  </ObserveReviewerContext.Provider>)
})

export const connectObserveReviewer = Comp => props => (<ObserveReviewerProvider {...props}>
  <Comp {...props} />
</ObserveReviewerProvider>)