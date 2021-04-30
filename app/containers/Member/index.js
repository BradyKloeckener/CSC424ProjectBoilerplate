/*

 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom'

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { changeUsername } from './actions';
import { makeSelectLoggedIn, makeSelectMemberStatus } from './selectors';
import reducer from './reducer';
import saga from './saga';

const key = 'home';

export function Member({
  org_id,
  member,
  MemberStatus,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  
  const [state, setState] = useState({user_email: member.user_email, status: member.status})
  const promoteMember = () =>{

    if(MemberStatus == 'Leader'){
      fetch('http://localhost:3000/promoteMember', {
          method: "POST",
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify({
              org_id: org_id,
              member: member.user_email
          })
        })
      .then(res => res.json())
      .then(data =>{
        if(data.success){ 

          setState({...state, status: 'Leader'})
        }
      })
    }
  }
  let promoteButton
   if(MemberStatus == 'Leader' && state.status != 'Leader'){
     promoteButton = <button className= 'btn btn-primary' onClick= {promoteMember} >Promote to Leader</button>
   }else{
     promoteButton = <div></div>
   }
    
    return(

      <div>
          <h6> {state.user_email}</h6>
          <p> {state.status}</p>
          {promoteButton}
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
  MemberStatus: makeSelectMemberStatus()
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
)(Member);
