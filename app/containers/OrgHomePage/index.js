/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useState} from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { changeLoginStatus } from './actions';
import { setMemberStatus } from '../OrgPageElements/actions';
import { makeSelectLoggedIn } from './selectors';
import { makeSelectMemberStatus } from '../OrgPageElements/selectors';
import reducer from './reducer';
import saga from './saga';







const key = 'home';

export function OrgHomePage({
 org_id,
 MemberStatus,
 onSetMemberStatus
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });



  const [state, setState]= useState({name: '', location: '', about: '', error: '', success: ''})

  useEffect(() => {
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
        onSetMemberStatus('Member')
        setState({...state, success: 'You have successfully joined this organization'})
        
      }
    })
    
  }

  const leaveOrg = (e)=>{

    e.preventDefault()
    fetch('http://localhost:3000/onLeaveOrg', {
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
        onSetMemberStatus('None')
        setState({...state, success: 'You have left the organization'})
       
      }
    })
    
  }

  let joinButton

    if(MemberStatus === 'No User'){
      joinButton = <p>You must be logged In to join the organization</p>
    }
    else if(MemberStatus === 'None'){
  
      joinButton = <button onClick={joinOrg} className= 'btn btn-primary'> Join Organization</button>
    }
    else if(MemberStatus === 'Member'){
      joinButton = <button onClick={leaveOrg} className= 'btn btn-primary'> Leave Organization </button>
    }
    else if(MemberStatus === 'Leader'){
  
      joinButton = <p>You are the leader of this organization</p>
    }  




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

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn(),
  MemberStatus: makeSelectMemberStatus(),
});

export function mapDispatchToProps(dispatch) {
  return {

    onChangeLoginStatus: () => dispatch(changeLoginStatus()),
    onSetMemberStatus: (newStatus)=> {
      dispatch(setMemberStatus(newStatus))
    }
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
