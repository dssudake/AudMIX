import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  AUTH_ERR_MSG,
  USER_FETCH_SUCCESS,
  USER_FETCH_FAIL,
  USER_LOADING_START,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  LOGOUT,
} from '../types';

const initialState = {
  isLoading: true,
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  isAuthenticated: null,
  user: null,
  errors: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADING_START:
      return {
        ...state,
        isLoading: true,
      };

    case USER_LOADED_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: payload,
      };

    case LOGIN_SUCCESS:
      localStorage.setItem('access', payload.access);
      localStorage.setItem('refresh', payload.refresh);
      return {
        ...state,
        access: payload.access,
        refresh: payload.refresh,
      };

    case USER_FETCH_SUCCESS:
      localStorage.setItem('user_entity', JSON.stringify(payload));
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
      };

    case AUTH_ERR_MSG:
      return {
        ...state,
        errors: payload,
      };

    case LOGIN_FAIL:
    case USER_FETCH_FAIL:
    case USER_LOADED_FAIL:
    case LOGOUT:
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user_entity');
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
        errors: payload,
        isLoading: false,
      };

    default:
      return state;
  }
}
