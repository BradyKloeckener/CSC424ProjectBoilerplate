/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, Fragment, useState} from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { changeLoginStatus } from './actions';
import { makeSelectLoggedIn, makeSelectMemberStatus } from './selectors';
import reducer from './reducer';
import saga from './saga';
import {Link } from 'react-router-dom'
import Member from 'containers/Member/Loadable'



const key = 'home';

export function OrgMemberPage({
  org_id, 
  MemberStatus 
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [state, setState] = useState({members: [] , isOrgLeader: true})
  useEffect(() => {
  
    fetch('http://localhost:3000/getMembers', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: org_id
        })
      })
    .then(res => res.json())
    .then(data => setState({...state, members: data}))
  }, []);



    return(
        <div>
            <h2> Members</h2>

            {state.members.map((member) => (

                <div key= {member.user_email}>
                <Member org_id={org_id} member = {member}/>
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

  loggedIn: makeSelectLoggedIn(),
  MemberStatus: makeSelectMemberStatus()
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
