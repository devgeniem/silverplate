import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import usersReducer from './users';
// main reducers
export const reducers = combineReducers({
  form: formReducer.plugin({
    user_edit: (state, action) => {
      // reset form (wipe state) when navigating away from the User edit page
      switch (action.type) {
        case '@@router/LOCATION_CHANGE':
          return undefined;
        default:
          return state;
      }
    },
  }),
  routing: routerReducer,
  users: usersReducer,

});
