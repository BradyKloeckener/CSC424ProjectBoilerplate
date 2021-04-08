/*

 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom'

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername, changeLoginStatus } from './actions';
import { makeSelectUsername, makeSelectLoggedIn} from './selectors';
import reducer from './reducer';
import saga from './saga';

const key = 'home';

export function UserProfile({
  
  loggedIn,
  onChangeLoginStatus
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
  }, []);

  const logout = (e)=> {
    e.preventDefault()
    fetch('http://localhost:3000/clearCookie', {
      method: 'POST',
      credentials: 'include'
    })
    .then(data =>{
      if(loggedIn === true){
        onChangeLoginStatus()
      }
    })
  }


  let logOutButton 
  if(loggedIn){
    logOutButton = <button onClick= {logout}>Log Out</button>
  }else{
    logOutButton = <div></div>
  }
  return (
    
    <div>
      <h2>This is where a user would see their profile</h2>
      {logOutButton}
    </div>
   

  );
}

// HomePage.propTypes = {
//   loading: PropTypes.bool,
//   error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
//   repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
//   onSubmitForm: PropTypes.func,
//   username: PropTypes.string,
//   onChangeUsername: PropTypes.func,
// };

const mapStateToProps = createStructuredSelector({
  // repos: makeSelectRepos(),
  // username: makeSelectUsername(),
  // loading: makeSelectLoading(),
  // error: makeSelectError(),
  loggedIn: makeSelectLoggedIn()
});

export function mapDispatchToProps(dispatch) {
  return {

    onChangeLoginStatus: () => dispatch(changeLoginStatus()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(UserProfile);
