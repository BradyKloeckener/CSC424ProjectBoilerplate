/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.home || initialState;

const makeSelectUsername = () =>
  createSelector(
    selectHome,
    homeState => homeState.username,
  );

const makeSelectLoggedIn = () =>
  createSelector(
    selectHome,
    homeState => homeState.loggedIn,
);


export { selectHome, makeSelectUsername , makeSelectLoggedIn};

