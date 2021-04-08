/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, Fragment, useState} from 'react';
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
import { changeUsername, changeLoginStatus, makeMember } from './actions';
import { makeSelectUsername, makeSelectLoggedIn, makeSelectMemberStatus } from './selectors';
import reducer from './reducer';
import saga from './saga';
import {Link } from 'react-router-dom'
import { header } from 'express-validator';
import { join } from 'bluebird';



const key = 'home';

export function OrgHomePage({
 org_id,
 MemberStatus,
 onMakeMember
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });


  const [state, setState]= useState({name: '', location: '', about: '', error: '', success: ''})

  useEffect(() => {
    console.log('org_id Line 55: ', org_id)
    if(org_id === ''){
      return
    }
    console.log('org_id: ', org_id)

    fetch('http://localhost:3000/getOrgHome', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: org_id
      })
    })
    .then(res => res.json())
    .then(data =>{
      if(!data.error){
        setState({name: data.name, location: data.location, about: data.about})
      }
    })
  }, [org_id]);



  const joinOrg = (e)=>{

    e.preventDefault()
    fetch('http://localhost:3000/onJoinOrg', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: org_id,})
    })
    .then(res => res.json())
    .then(data => {
      if(data.error){
        setState({...state, error: data.error})
      }else{
        setState({...state, success: 'You have successfully joined this organization'})
        onMakeMember()
      }
    })
    
  }


let joinButton
// useEffect(() =>{
 

  if(MemberStatus === 'No User'){
    joinButton = <p>You must be logged In to join the organization</p>
  }
  else if(MemberStatus === 'None'){

    joinButton = <button onClick={joinOrg} className= 'btn btn-primary'> Join Organization</button>
  }
  else if(MemberStatus === 'Member' || MemberStatus === 'Leader'){
    joinButton = <p> You are a part of this Organization</p>
  }
// }, [MemberStatus])

  

  return(
    <div>
        <h2>{state.name} Home Page</h2>

        <h3>Location: {state.location} </h3>
        <h3>About {state.name}:</h3>
        <p>{state.about}</p>
        {joinButton}
        <p>{state.error}</p>
        <p>{state.success}</p>
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
  loggedIn: makeSelectLoggedIn(),
  MemberStatus: makeSelectMemberStatus(),
});

export function mapDispatchToProps(dispatch) {
  return {

    onChangeLoginStatus: () => dispatch(changeLoginStatus()),
    onMakeMember: () => dispatch(makeMember())

  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(OrgHomePage);
