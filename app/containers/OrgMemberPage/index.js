/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useLayoutEffect, memo, Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

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
import { makeSelectUsername, makeSelectLoggedIn } from './selectors';
import reducer from './reducer';
import saga from './saga';
import {Link } from 'react-router-dom'
import Member from 'containers/Member/Loadable'



const key = 'home';

export function OrgMemberPage({ org_id }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  [state, setState] = useState({members: [] , isOrgLeader: true})
  useLayoutEffect(() => {
  
    fetch('http://localhost:3000/getMembers', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: org_id
        })
        .then(res => res.json())
        .then(data => setState({...state, members: data}))
    })
  }, []);



    return(
        <div>
            <h1> Members</h1>

            {state.members.map((member) => (

                <div key= {member.user_email}>
                <Member member = {member}/>
                </div>
            ))}


        </div>

    )
    
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
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
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
)(OrgMemberPage);
