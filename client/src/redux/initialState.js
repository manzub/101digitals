const initialState = {
  user: {
    email: null,
    password: null,
    role: null
  },
  app: {
    loaded: false,
    socket: null,
    messages: null,
    services: null,
    chatroom: null
  }
}

export default initialState;