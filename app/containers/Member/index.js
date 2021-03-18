/*

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
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

const key = 'home';

export function Member({
  event
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

//   [state, setState] = useState({showContent: false})
 
//   const toggleContent = ()=>{

//     setState({...state, showContent: !state.showContent})
// }


   

    // let Content
    // if(this.state.showContent){
    //     Content = ( 
    //     <div>
    //         <p>{event.address}</p>
    //         <p>{event.date}</p>
    //         <p>{event.time}</p>
    //         <p>{event.description}</p>

    //     </div>
        
    //     )
    // }else{
    //     Content = <div></div>
    // }
    return(

      <div>
          <h4> {member.user_email}</h4>
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
  // repos: makeSelectRepos(),
  // username: makeSelectUsername(),
  // loading: makeSelectLoading(),
  // error: makeSelectError(),
  loggedIn: makeSelectLoggedIn()
});

export function mapDispatchToProps(dispatch) {
  return {

    onChangeLoginStatus: () => dispatch(changeLoginStatus()),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      //dispatch(loadRepos());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Member);
