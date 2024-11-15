import { sendMail } from "Method/mailer";
import { connect } from "react-redux";
const { createContext, useState } = require("react");

export const AdminSubmitContext = createContext({});

const AdminSubmitProvider = connect(s => ({ user: s.user.data }))(({ children, ...props }) => {
  const [state,setState] = useState({

  });

  const store = {
    ...props,
    sendMail,
    state: [state,setState],
  }
  
  return (<AdminSubmitContext.Provider value={store}>
    {children}
  </AdminSubmitContext.Provider>)
});

export const connectAdminSubmit = Comps => props => (<AdminSubmitProvider {...props}>
  <Comps {...props} />
</AdminSubmitProvider>)