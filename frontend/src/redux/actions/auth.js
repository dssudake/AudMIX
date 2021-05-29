import api from '../../utils/api';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  AUTH_ERR_MSG,
  USER_FETCH_SUCCESS,
  USER_FETCH_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  LOGOUT,
} from '../types';

export const load_user = () => async (dispatch) => {
  if (typeof window == 'undefined') {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
  if (localStorage.getItem('access') && localStorage.getItem('user_entity')) {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ token: localStorage.getItem('access') });

    try {
      const res = await api.post('auth/jwt/verify/', body, config);

      if (res.data.code !== 'token_not_valid') {
        const user = JSON.parse(localStorage.getItem('user_entity'));
        dispatch({
          type: USER_LOADED_SUCCESS,
          payload: user,
        });
      } else {
        dispatch({
          type: USER_LOADED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: USER_LOADED_FAIL,
      });
    }
  } else {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
};

export const user_fetch = () => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${localStorage.getItem('access')}`,
      Accept: 'application/json',
    },
  };

  try {
    const res = await api.get('auth/users/me/', config);

    dispatch({
      type: USER_FETCH_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: USER_FETCH_FAIL,
    });
  }
};

export const login = (username, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ username, password });

  try {
    const res = await api.post('auth/jwt/create/', body, config);
    if (res.status === 200 || res.status === 201) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(user_fetch());
    }
  } catch (err) {
    var res = err.response;
    var msg = '';
    if (res.status === 400 || res.status === 403 || res.status === 401) {
      msg = 'Invalid Username or Password.';
    } else {
      msg = 'Something went wrong! Login Failed';
    }

    dispatch({
      type: LOGIN_FAIL,
      payload: msg,
    });
  }
};

export const auth_err_msg = (msg) => (dispatch) => {
  dispatch({ type: AUTH_ERR_MSG, payload: msg });
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
