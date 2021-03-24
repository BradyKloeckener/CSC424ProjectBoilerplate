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
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { makeSelectLoggedIn } from '../NavBar/selectors';
import '../App.css'

const key = 'home';

export function RegisterOrgPage({
  loggedIn,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [state, setState] = useState({name: '', location: '', about: '', error: '', success: ''})

  // useEffect(() => {

  // }, []);

 

  const handleSubmit = (e)=> {
    //TO DO
    e.preventDefault()

     fetch('http://localhost:3000/registerOrgSubmit', {
         method: 'POST',
       
         credentials: 'include',
         headers: {
             'Content-type': 'application/json'
         },
         body: JSON.stringify({name: state.name, location: state.location, about: state.about})
     })
     .then(result=> result.json())
     .then(data => {

         if(data.error){
                 setState({...state, error : data.error})
         }
         if(data.success){
             
             setState({...state, success: 'Your organization has been added successfully'})
             resetForm()
         }
     })
     //setState({...state, error: 'Password and Confirm Password fields must match'})

     // Send Data to server 
    
 }

    const handleChange = (e)=>{
    //Used when characters are typed into the input field

            setState({
            ...state,
            [e.target.name]: e.target.value
            });
    }

  //Set form back to initial state
  const resetForm =()=>{
          setState({ name: '', location: '',about: '', error: '' })
  }

 

     return(
       <div>
         <h2>Register Your Organization</h2>
         <form onSubmit = {handleSubmit} method="POST">
             <div className="formcontent">   
             
                 <div className="form-group">
                     <label htmlFor='name'> Organization Name: </label>
                     <input className="form-control" type='text' id ='name' name='name' value={state.name} onChange= {handleChange} required/>
                 </div>

                 <div className="form-group">
                     <label htmlFor='location'> Location: </label>
                     <input className="form-control" type='text' id ='location' name='location' value={state.location} onChange= {handleChange}/>
                 </div>

                 <div className="form-group">
                     <label htmlFor='about'> About: </label>
                     <textarea className="form-control" id= 'about' name='about' value= {state.about} onChange= {handleChange} rows='4' cols='50'/>
                 </div>

                 <p>{state.error}</p>
                 <p>{state.success}</p>
                 
                 <input className="btn btn-primary" type= 'submit' value= 'Register Your Organization'/>
             
             </div>
         </form>
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
    // onChangeUsername: () => dispatch(changeUsername(evt.target.value)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(RegisterOrgPage);
