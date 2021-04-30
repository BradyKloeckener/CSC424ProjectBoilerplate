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
import { Link, Redirect } from 'react-router-dom'
import '../css/MainNavBar.css'




const key = 'home';

export function NavBar({
  loggedIn,
  changeLoginStatus,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    fetch('http://localhost:3000/checkIfloggedIn', {
            method:'POST',
            credentials: 'include'
        
        })
        .then(res => res.json())
        .then(data => {
            if(data.user){
                //update redux store if cookie exist
                //default state will be false so change it to true
                if(loggedIn === false){
                    changeLoginStatus()
                }
                //this.setState({...this.state, loggedIn: true})
            }
        })
  }, []);
  

  // const LogOut = () =>{

  //   fetch('http://localhost:3000/clearCookie', {
  //     method:'POST',
  //     credentials: 'include'
  
  // })
  // .then(data =>{
  //   if(loggedIn === true){
  //     changeLoginStatus()
  //     return <Redirect to= '/'/>
  //   }

  // })
  // }


      let activeLinks 
        if(loggedIn){
            activeLinks = (
                
            <Fragment>
                 <Link to= '/orgs'  className= 'navLink'>
                         <li> Your Organizations </li>
                     </Link>
                     <Link to= '/registerOrg'  className= 'navLink'>
                         <li> Register Your Organization </li>
                    </Link>
                     <Link to= '/profile'  className= 'navLink'>
                         <li> Your Profile </li>
                     </Link>
                     {/* <li onClick= {LogOut} className= 'navLink'>Log Out</li> */}
            </Fragment>
        )}
        else{
            activeLinks = (
            <Fragment>
                <Link to= '/login'  className= 'navLink'>
                    <li> Log In</li>
                </Link>
                <Link to= '/signup'  className= 'navLink'>
                    <li>Sign Up</li>
                </Link>
            </Fragment>

            )
        }

        return (
        <nav id = 'mainNav'>
            <ul>
            <Link to= '/' className= 'navLink'>
                <li> Home </li>
            </Link>
            <Link to= '/browse'  className= 'navLink'>
                <li> Browse Organizations </li>
            </Link>
       
            {activeLinks}
            
        </ul>
      </nav>
  );
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
)(NavBar);
