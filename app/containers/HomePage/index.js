/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { changeLoginStatus } from './actions';
import { makeSelectLoggedIn } from './selectors';
import reducer from './reducer';
import saga from './saga';


const key = 'home';

export function HomePage({
 loggedIn,
 onChangeLoginStatus
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
 
  }, []);

  return (
    <div>
      <h2>All your Organizations in one Place</h2>
      <p> 
        This is a platform for you to keep all of your organizations organized. Check out the "Browse Organizations" page to find some organizations that interest you.
        The leaders of the organization will post Announcements and Events for everyone to see. If you are looking to use our platform for your own organization,
        make sure you are logged in and click the "Register Your Organization" button.
         </p>
    </div>
  );
}



const mapStateToProps = createStructuredSelector({

  loggedIn: makeSelectLoggedIn()
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeLoginStatus: () => dispatch(changeLoginStatus()),
  }

}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
