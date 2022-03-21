const initialState = {
  user: {
    email: null,
    password: null,
    role: null
  },
  // TODO: config values e.g admin wallet address
  app: {
    loaded: false,
    socket: null,
    messages: null,
    services: null
  }
}

export default initialState;