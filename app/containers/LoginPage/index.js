/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useLayoutEffect, memo, Fragment, useState} from 'react';
import Redirect from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { changeUsername, changeLoginStatus } from './actions';
import { makeSelectUsername, makeSelectLoggedIn } from './selectors';
import reducer from './reducer';
import saga from './saga';

// import {Link } from 'react-router-dom'



const key = 'home';

export function LoginPage({

  loggedIn,
  onChangeLoginStatus,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });



  const [state, setState] = useState({email: '', password: '', error: '', success: ''})

  useLayoutEffect(() => {
    // When initial state username is not null, submit the form to load repos
    fetch('http://localhost:3000/clearCookie',{
      method: 'POST',
      credentials: 'include',
    })
    .then(() =>{
      if(loggedIn === true){
        onChangeLoginStatus()
      }
    })
    

  }, []);

  // useEffect(() => {
  //   // When initial state username is not null, submit the form to load repos
  //   if(loggedIn){
  //     console.log('Redirecting')
  //     return <Redirect to='/'/>
  //   }

  // }, [loggedIn]);


  

  const handleSubmit = (e) => {

    e.preventDefault()
    fetch('http://localhost:3000/loginSubmit', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email: state.email, password: state.password})
    })
    .then(result=> result.json())
    .then(data => {


        if(data.error){
            setState({...state, error: data.error})
        }
        else{
          onChangeLoginStatus()
          setState({...state, loggedIn: true, success: true})

        }
    })




    // Process Data on server
  //resetForm()
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
//    setState({ email: '', password: ''})    
// }



if(loggedIn){
//  return <Redirect to= '/'/> 
return <div>Your Log In was succesful. You can now join and create Organizations</div>
} 


  return(
    <form onSubmit = {handleSubmit} method="POST">
            <div className="formcontent">               
                <label htmlFor="email">Email: </label>
                <input type="text" name="email" id="email" value={state.email} onChange= {handleChange} required/> 

                <label htmlFor= "password">Password: </label>
                <input type="password" name ="password" id= "password" value={state.password} onChange={handleChange} required/>

                <input type= "submit" value= "Login"/>
                
                <p id='errorMessage'>{state.error} </p>
            
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
      //dispatch(loadRepos());
  }
}


const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(LoginPage);
