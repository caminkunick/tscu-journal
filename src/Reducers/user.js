const init = {
  data: null,
  fetched: false,
};

const userReducer = (state = init, action) => {
  switch (action.type) {
    case 'USER_SET':
      return { data:action.data, fetched:true }
    case 'USER_UNSET':
      return init;
    default:
      return state
  }
};

export default userReducer;