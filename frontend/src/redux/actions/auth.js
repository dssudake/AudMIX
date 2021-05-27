import api from '../../utils/api';
import { SIGNUP_SUCCESS, SIGNUP_FAIL, DEFAULT_AUTH_STORE, CLR_ERR_MSG } from '../types';

export const signup = (username, email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ username, email, password });

  try {
    const res = await api.post('auth/users/', body, config);
    if (res.status === 200 || res.status === 201) {
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: 'Successfully Signed Up! Activation link has been sent to your email account.',
      });
    }
  } catch (err) {
    console.log(err);
    var res = err.response;
    var msg = '';
    if (res.status === 400 || res.status === 403 || res.status === 401) {
      if (res.data.username !== undefined) {
        if (
          res.data.username[0].search('already') !== -1 &&
          res.data.username[0].search('exists') !== -1
        ) {
          msg = 'Username Already Taken. Try with other.';
        }
      } else if (res.data.password !== undefined) {
        msg = 'Please Enter Strong Password with minimum 8 characters.';
      } else {
        msg = 'Enter Valid Credentials.';
      }
    } else {
      msg = 'Something went wrong! Registeration Failed';
    }

    dispatch({
      type: SIGNUP_FAIL,
      payload: msg,
    });
  }
};

export const auth_default = () => (dispatch) => {
  dispatch({ type: DEFAULT_AUTH_STORE });
};

export const clear_err_msg = () => (dispatch) => {
  dispatch({ type: CLR_ERR_MSG });
};
