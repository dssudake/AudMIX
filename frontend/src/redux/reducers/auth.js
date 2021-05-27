import { SIGNUP_SUCCESS, SIGNUP_FAIL, DEFAULT_AUTH_STORE, CLR_ERR_MSG } from '../types';

const initialState = {
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  isAuthenticated: null,
  user: null,
  isRegistered: null,
  errors: '',
  regErrors: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isRegistered: true,
        regErrors: payload,
      };

    case SIGNUP_FAIL:
      return {
        ...state,
        isRegistered: false,
        regErrors: payload,
      };

    case DEFAULT_AUTH_STORE: {
      return {
        ...state,
        errors: '',
        regErrors: '',
        isRegistered: false,
      };
    }

    case CLR_ERR_MSG: {
      return {
        ...state,
        errors: '',
        regErrors: '',
      };
    }

    default:
      return state;
  }
}
