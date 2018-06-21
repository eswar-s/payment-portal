import { AUTHENTICATED, AUTHENTICATING, UNAUTHENTICATED, AUTHENTICATION_ERROR } from '../action-types/auth';

export const authenticate = (token, code) => {

  return async dispatch => {
    try {
      dispatch({
        type: AUTHENTICATING
      })

      const response = await fetch(`http://localhost:8080/authenticate?token=${token}&code=${code}`)
      const data = await response.json();
      if (data.status === 'success') {
        localStorage.setItem('token', token);
        localStorage.setItem('code', code);
        dispatch({type: AUTHENTICATED, payload: data.customer})
      } else {
        dispatch({type: AUTHENTICATION_ERROR, payload: data.message})
      }
    } catch(error) {
      dispatch({type: AUTHENTICATION_ERROR, payload: 'Server unreachable, Please contact customer support'})
    }
  }
}