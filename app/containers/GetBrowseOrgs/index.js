/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useState } from 'react';
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
import { changeUsername, changeLoginStatus  } from './actions';
import { makeSelectUsername, makeSelectLoggedIn } from './selectors';
import reducer from './reducer';
import saga from './saga';
import RenderOrgCards from 'containers/RenderOrgCards/Loadable';


const key = 'home';

export function GetBrowseOrgs({

  loggedIn,
  onChangeLoginStatus

}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [state, setState] = useState({ rec: [], orgs:[] })

  useEffect(() => {

    fetch('http://localhost:3000/getBrowseOrgs',{
      method: 'POST',
    })
    .then(res => res.json())
    .then(data =>{
        if(data.rec){
          setState({...state, rec: data.rec, orgs: data.orgs})
        }else{
          setState({...state, orgs: data.orgs})
        }
    })
  }, []);

  console.log('recommended: ', state.rec)
  console.log('orgs', state.orgs)
  let recommendations

  if(state.rec.length != 0){
    recommendations = (
      <div>
        <h4>Recommended For You</h4>
        <RenderOrgCards orgs = {state.rec} />
      </div>
    )
  }
  
  

  if(state.orgs.length === 0){
    return(
        <p>There are no organizations registered yet. Be the first to register your orgaization!!!</p>
    )
  }

  return(
      <div>  
          {recommendations}
          <h4>All Organizations</h4>
          <RenderOrgCards orgs= {state.orgs}/>    
      </div>
  )
}

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn()
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeLoginStatus: () => dispatch(changeLoginStatus())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(GetBrowseOrgs);
