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
import Redirect from 'react-router-dom'
import '../App.css'
import '../css/SignUp.css'



const key = 'home';

export function SignUpPage({
  loggedIn,
  onChangeLoginStatus,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [state, setState] = useState({name: '',email:'', password: '', confirmPassword: '', error:''})

  useLayoutEffect(() => {
    // When initial state username is not null, submit the form to load repos
    fetch('http://localhost:3000/clearCookie',{
      method: 'POST',
      credentials: 'include',
    })
    if(loggedIn === true){
      onChangeLoginStatus()

    }
  }, []);

 
  const handleSubmit = (e) => {

    e.preventDefault()
    if(state.password !== state.confirmPassword){
      setState({...state, error: 'Password and Confirm Password fields must match'})
    }else{
   
      fetch('http://localhost:3000/signUpSubmit', {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify({ name: state.name, email: state.email, password: state.password})
      })
      .then(result=> result.json())
      .then(data => {


          if(data.error){
              setState({...state, error: data.error})
          }
          else{
            onChangeLoginStatus()
              setState({...state, success: true})
          }
      })

    }




    // Process Data on server
}

const handleChange = (e) => {
//Used when characters are typed into the input field
    setState({
      ...state,
      [e.target.name]:  e.target.value
    });
}

//Set form back to initial state
// const resetForm = () => {
//     setState({ email: '', password: ''})    
// }



    if(loggedIn){
        // return <Redirect to= '/'/>
        return <div>You signed up succesfully! Welcome! You can now join and create Organizations</div>
     }

     return(
      <form onSubmit = {handleSubmit} method="POST">
          <div className="formcontent">   
          
              <label htmlFor='name'> Name: </label>
              <input type='text' id ='name' name='name' value={state.name} onChange= {handleChange} required/>
          
              <label htmlFor='email'> Email: </label>
              <input type='text' id ='email' name='email' value={state.email} onChange= {handleChange} required/>

              <label htmlFor= 'password'>Password: </label>
              <input type='password' id ='password' name ='password' value={state.password} onChange= {handleChange} required/>

              <label htmlFor= 'confirmPassword'>Confirm Password: </label>
              <input type='password' id = 'confirmPassword' name ='confirmPassword' value={state.confirmPassword} onChange= {handleChange} required/>
      
              <input type= 'submit' value= 'Create Account'/>
              <p id= 'errorMessage'>{state.error}</p>
              
          </div>
      </form>
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
    // onSubmitForm: evt => {
    //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //   dispatch(loadRepos());
    // },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SignUpPage)
