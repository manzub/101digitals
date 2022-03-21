import initialState from './initialState';

export function userReducers(state = initialState.user, action) {
  switch (action.type) {
    case 'SIGNIN':
      return { ...action.payload }
    case 'LOGOUT':
      return { state }
    case 'REFRESH-USER':
      return { ...state, ...action.payload }
    default:
      return state;
  }
}

export function appReducer(state = initialState.app, action) {
  switch (action.type) {
    case 'SOCKET':
      return { ...state, socket:action.payload };
    case 'MESSAGES':
      return { ...state, messages: action.payload };
    case 'LOADING':
      return { ...state, loaded: false }
    case 'LOADED':
      return { ...state, ...action.payload, loaded: true }
    default:
      return state;
  }
}