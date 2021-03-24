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
import {Routes, Route, useRouteMatch, useParams} from 'react-router-dom'
import OrgNavBar from 'containers/OrgNavBar/Loadable'
import OrgHomePage from 'containers/OrgHomePage/Loadable'
import OrgAnnouncementPage from 'containers/OrgAnnouncementPage/Loadable'
import OrgEventPage from 'containers/OrgEventPage/Loadable'
import OrgMemberPage from 'containers/OrgMemberPage/Loadable'






const key = 'home';

export function OrgPageElements({
    loggedIn,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const params = useParams()

  const [state, setState] = useState({org_id: params.org_id, MemberStatus: 'NotDefined', error: ''})

  console.log('Org Page Elements: ' , state.org_id)

  useLayoutEffect(() => {
  
    fetch('http://localhost:3000/checkMemberStatus', {
        
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: params.org_id})

    })
    .then(res => res.json())
    .then(data =>{

        if(data.error){
            setState({...state, error: data.error})
        }else{
          setState({...state, MemberStatus: data.status})
        }


    })

   
  }, []);


  return(
    <div>
        <OrgNavBar org_id = {state.org_id} MemberStatus = {state.MemberStatus} />
        <div>
        
        <Routes>
            {/* <Route path= {'/organization/' + state.org_id + '/orgHome'} element={
                <OrgHomePage org_id= {state.org_id} MemberStatus= {state.MemberStatus}/>
            } />
            <Route path= {'/organization/' + state.org_id + '/announcements'} element= {
                <OrgAnnouncementPage org_id= {state.org_id} MemberStatus= {state.MemberStatus} />
            } />
            <Route path ={'/organization/' + state.org_id + '/events'} element= {
                <OrgEventPage org_id= {state.org_id} MemberStatus= {state.MemberStatus}/>
            }/>  
            <Route path= {'/organization/' + state.org_id + '/members'} element= {
                <OrgMemberPage org_id= {state.org_id} MemberStatus= {state.MemberStatus}  />
            } /> */}
            {/* <Route path= '/chat' render= {(props) => (
                <OrgChat {...props} org_id= {state.org_id} />
            )}/> */}

            <Route path= '/orgHome' element={
                <OrgHomePage org_id= {state.org_id} MemberStatus= {state.MemberStatus}/>
            } />
            <Route path= '/announcements' element= {
                <OrgAnnouncementPage org_id= {state.org_id} MemberStatus= {state.MemberStatus} />
            } />
            <Route path ='/events' element= {
                <OrgEventPage org_id= {state.org_id} MemberStatus= {state.MemberStatus}/>
            }/>  
            <Route path= '/members' element= {
                <OrgMemberPage org_id= {state.org_id} MemberStatus= {state.MemberStatus}  />
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
)(OrgPageElements);
