import { AUTHENTICATED, AUTHENTICATING, UNAUTHENTICATED, AUTHENTICATION_ERROR } from '../action-types/auth';

const initialState = {
  authenticated: false,
  isAuthenticating: false,
  customer: undefined,
  error: ''
}

export default (state = initialState, action) => {
  switch(action.type) {
    case AUTHENTICATING:
      return { ...state, authenticated: false, isAuthenticating: true, error: ''};
    case AUTHENTICATED:
      return { ...state, authenticated: true, isAuthenticating: false, error: '', customer: action.payload };
    case UNAUTHENTICATED:
      return { ...state, authenticated: false, isAuthenticating: false, error: '' };
    case AUTHENTICATION_ERROR:
      return { ...state, authenticated:false, error: action.payload, isAuthenticating: false };
    default:
      return state
  }
}
