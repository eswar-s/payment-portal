import { AUTHENTICATED, AUTHENTICATING, AUTHENTICATION_ERROR } from '../action-types/auth';

export const authenticate = (token, code) => {

  return async dispatch => {
    try {
      dispatch({
        type: AUTHENTICATING
      })

      const response = await fetch(`${process.env.REACT_APP_API_AUTH_URL}?token=${token}&code=${code}`)
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