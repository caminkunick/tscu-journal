import { db } from "Modules/firebase";
import { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";

const maillog = {
  get: async (jid) => {
    const snap = await db
      .collection("journals")
      .doc(jid)
      .collection("logs")
      .orderBy("id")
      .get();
    const docs = snap.docs
      .map((doc) => ({ ...doc.data(), key: doc.id }))
      .reduce((total, doc) => {
        if (total[doc.id]) {
          total[doc.id].push(doc);
        } else {
          total[doc.id] = [doc];
        }
        return total;
      }, {});
    const submits = Object.assign(
      {},
      ...(await Promise.all(
        Object.keys(docs).map(async (id) => {
          const snap = await db
            .collection("journals")
            .doc(jid)
            .collection("submits")
            .doc(id)
            .get();
          return { [id]: { ...snap.data(), id } };
        })
      ))
    );
    return { docs, submits };
  },
};

export const MailLogContext = createContext({});

const MailLogProvider = connect((s) => ({ user: s.user.data }))(
  ({ dispatch, user, children, ...props }) => {
    const [state, setState] = useState({
      fetched: false,
      docs: [],
    });
    const store = {
      ...props,
      ...props.match.params,
      user,
      dispatch,
      state: [state, setState],
    };

    useEffect(() => {
      maillog
        .get(store.jid)
        .then((result) => setState((s) => ({ ...s, ...result, fetched: true })));
    }, [store.jid]);

    return (
      <MailLogContext.Provider value={store}>
        {children}
      </MailLogContext.Provider>
    );
  }
);

export const connectMailLog = (Comp) => (props) => (
  <MailLogProvider {...props}>
    <Comp {...props} />
  </MailLogProvider>
);
