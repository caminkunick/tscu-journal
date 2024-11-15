const init = {};

const alertReducer = (state = init, action) => {
  switch (action.type) {
    case 'ALERTS_PUSH':
      let key = Date.now()+"-"+("0000" + Math.random(1000)).slice(-4);
      return { ...state, [key]:action.data }
    case 'ALERTS_CLOSE':
      let newAlerts = {...state};
      delete newAlerts[action.index];
      return newAlerts;
    case 'ALERTS_CLEAR':
      return { ...init };
    default:
      return state
  }
};

export default alertReducer;