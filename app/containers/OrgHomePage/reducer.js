/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { CHANGE_LOGIN_STATUS, CHANGE_MEMBER_STATUS,} from './constants';

// The initial state of the App
export const initialState = {
  loggedIn: false,
  MemberStatus: 'No User'
};

/* eslint-disable default-case, no-param-reassign */
const homeReducer = (state = initialState, action) =>
  
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_LOGIN_STATUS: 
        draft.loggedIn = !state.loggedIn
        break
      case CHANGE_MEMBER_STATUS:
        draft.MemberStatus = action.newStatus
        break
    }
  });

export default homeReducer;
