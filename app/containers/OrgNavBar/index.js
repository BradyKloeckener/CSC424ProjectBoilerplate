/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, Fragment} from 'react';
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
import { Link } from 'react-router-dom'


import '../App.css'
import '../css/OrgNavBar.css'



const key = 'home';

export function OrgNavBar({
  org_id,
  MemberStatus,
  loggedIn,
  changeLoginStatus,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  return(
    <nav id = 'OrgNav'>
        <ul>
        <Link to= {'/organization/' + org_id + '/orgHome'} className= 'OrgLink'>
            <li> Organization Home </li>
        </Link>
        <Link to= {'/organization/' + org_id + '/announcements'} className= 'OrgLink'>
            <li> Announcements </li>
        </Link>
        <Link to={'/organization/' + org_id + '/events'} className= 'OrgLink'>
            <li> Events </li>
        </Link>
        <Link to= {'/organization/' + org_id + '/members'} className= 'OrgLink'>
            <li> Members</li>
        </Link>
        {/* <Link to= '/chat' className= 'OrgLink'>
            <li> Chat</li>
        </Link> */}

    </ul>
  </nav>
)
}


const mapStateToProps = createStructuredSelector({

  loggedIn: makeSelectLoggedIn()
});

export function mapDispatchToProps(dispatch) {
  return {
    // onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    changeLoginStatus: () => dispatch(changeLoginStatus()),
    }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(OrgNavBar);
