import { db } from "Modules/firebase";
import { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";

class ObserveSubmitController {
  constructor(jid, sid) {
    this.jid = jid;
    this.sid = sid;
  }
  get = async () => {
    const submitQuery = await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).get();
    const filesQuery = await db.collection('journals').doc(this.jid).collection('submits').doc(this.sid).collection('files').get();
    const discussQuery = await db.collection('journals').doc(this.jid).collection('discussions').where('parent','==',this.sid).get();
    const usersQuery = await db.collection('journals').doc(this.jid).collection('users').get();
    const reviewersQuery = await db.collection('journals').doc(this.jid).collection('reviewers').where('parent','==',this.sid).get();

    return {
      submit: submitQuery.data(),
      files: filesQuery.docs.map(doc=>({ ...doc.data(), id:doc.id })),
      discuss: discussQuery.docs.map(doc=>({ ...doc.data(), id:doc.id })),
      users: Object.assign({}, ...usersQuery.docs.map(user=>({ [user.id]:{...user.data(), id:user.id } }))),
      reviewers: reviewersQuery.docs.map(doc=>({ ...doc.data(), id:doc.id })),
    }
  }
}

export const ObserveSubmitContext = createContext({});

const defaultState = {
  fetched: false,
  submit: null,
  tab: 0,
  files: [],
  users: {},
  reviewers: [],
}
const ObserveSubmitProvider = connect(s => ({ user: s.user.data }))(({ children, user, ...props }) => {
  const { jid, sid } = props.match.params;
  const [state, setState] = useState({ ...defaultState });
  const [Controller] = useState(new ObserveSubmitController(jid, sid));

  const store = {
    ...props,
    ...props.match.params,
    user,
    Controller,
    state: [state, setState],
    getFiles: group => Object.assign({}, ...state.files.filter(file=>file.group===group).map(file=>({ [file.id]:file }))),
    getDiscuss: group => state.discuss.filter(discuss=>discuss.group===group),
  }

  useEffect(() => {
    Controller.get().then(results => setState(s => ({ ...s, ...results, fetched: true })));
  }, [jid, sid, user, Controller])

  return (<ObserveSubmitContext.Provider value={store}>
    {children}
  </ObserveSubmitContext.Provider>)
})

export const connectObserveSubmit = Comp => props => (<ObserveSubmitProvider {...props}>
  <Comp {...props} />
</ObserveSubmitProvider>)