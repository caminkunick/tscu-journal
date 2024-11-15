import { db } from "Modules/firebase";
import { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";

class ObserveSubmitController {
  constructor(jid) {
    this.jid = jid;
  }
  get = async () => {
    const snap = await db.collection('journals').doc(this.jid).collection('submits').orderBy('date','desc').get();
    return snap.docs.map(doc=>({ ...doc.data(), id:doc.id }))
  }
}

export const ObserveSubmit = createContext({});

const ObserveProvider = connect(s => ({ user: s.user.data }))(({ children, user, ...props }) => {
  const { jid } = props.match.params;
  const [state, setState] = useState({
    fetched: false,
    docs: [],
  });
  const [Controller] = useState(new ObserveSubmitController(jid));

  const store = {
    ...props,
    ...props.match.params,
    user,
    state: [state, setState],
    Controller,
  };

  useEffect(() => {
    if(user && jid){
      return Controller.get().then(docs=>setState(s=>({ ...s, docs, fetched:true })));
    }
  }, [jid,user,Controller])

  return (<ObserveSubmit.Provider value={store}>
    {children}
  </ObserveSubmit.Provider>)
})

export const connectObserveSubmit = Comp => props => (<ObserveProvider {...props}>
  <Comp {...props} />
</ObserveProvider>)