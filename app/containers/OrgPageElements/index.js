/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {changeLoginStatus, setMemberStatus } from './actions';
import {makeSelectLoggedIn, makeSelectMemberStatus } from './selectors';
import reducer from './reducer';
import saga from './saga';
import {Routes, Route, useParams} from 'react-router-dom'
import OrgNavBar from 'containers/OrgNavBar/Loadable'
import OrgHomePage from 'containers/OrgHomePage/Loadable'
import OrgAnnouncementPage from 'containers/OrgAnnouncementPage/Loadable'
import OrgEventPage from 'containers/OrgEventPage/Loadable'
import OrgMemberPage from 'containers/OrgMemberPage/Loadable'







const key = 'home';

export function OrgPageElements({
    loggedIn,
    MemberStatus,
    onSetMemeberStatus
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const params = useParams()

  const [state, setState] = useState({org_id: params.org_id, error: ''})


  useEffect(() => {
  
    fetch('http://localhost:3000/checkMemberStatus', {
        
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: state.org_id})

    })
    .then(res => res.json())
    .then(data =>{

        if(data.error){
            setState({...state, error: data.error})
        }else{
          onSetMemeberStatus(data.status)
        }


    })

   
  }, [MemberStatus]);


  return(
    <div>
        <OrgNavBar org_id = {state.org_id} />
        <div>
        
        <Routes>
            <Route path= '/orgHome' element={
                <OrgHomePage org_id= {state.org_id} />
            } />
            <Route path= '/announcements' element= {
                <OrgAnnouncementPage org_id= {state.org_id} />
            } />
            <Route path ='/events' element= {
                <OrgEventPage org_id= {state.org_id}/>
            }/>  
            <Route path= '/members' element= {
                <OrgMemberPage org_id= {state.org_id} />
            } /> 
            
        </Routes>
        </div>

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
    onSetMemeberStatus: (evt) => dispatch(setMemberStatus(evt))

  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(OrgPageElements);
