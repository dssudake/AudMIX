const initialState = {
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  isAuthenticated: null,
  user: null,
  errors: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  console.log(payload);

  switch (type) {
    default:
      return state;
  }
}
