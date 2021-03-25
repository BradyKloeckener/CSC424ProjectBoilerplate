/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, Fragment, useState} from 'react';
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
import { makeSelectUsername, makeSelectLoggedIn, makeSelectMemberStatus} from './selectors';
import reducer from './reducer';
import saga from './saga';
import {Link } from 'react-router-dom'
import Event from 'containers/Event/Loadable'


const key = 'home';

export function OrgEventPage({ 
  org_id,
  MemberStatus,

}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [state, setState] = useState({events: [], formShown: false, name: '', address: '', date: '', time: '', description: '', error: '', success: ''})
  useEffect(() => {
  
    fetch('http://localhost:3000/getEvents', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: org_id
        })
    })
    .then(res => res.json())
    .then(data => setState({...state, events: data}))
  }, []);



  const toggleform = ()=>{

    setState({...state, formShown: !state.formShown})

  }

const submitForm = (e)=> {
    e.preventDefault()
    fetch('http://localhost:3000/onEventSubmit', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: org_id, 
            name: state.name, 
            location: state.location,
            date: state.date,
            time: state.time,
            description: state.description
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.error){
            setState({...state, error: data.error})
        }
        else if(data.success){
            let newEvent = state.events.concat({name: state.name, address: state.address, date: state.date, time: state.time, description: state.description})
            setState({...state, events: newEvent, success: data.success})

        }
    })
}

    const handleChange =(e) =>{
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }


    let AddEventButton
    
    if (MemberStatus === 'Leader'){
        AddEventButton = <button onClick= {toggleform}>Add an Event</button>
    }
    else{
        AddEventButton = <div></div>
    }

        let EventForm
        if(state.formShown){

            EventForm = (
            <form onSubmit = {submitForm}>
                <div className="formcontent">

                    <div className="form-group">
                        <label htmlFor= 'eventName'> Event Name</label>
                        <input className="form-control" onChange={handleChange} type= 'text' id= 'eventName' name= 'name' required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor= 'eventDate'> Event Date</label>
                        <input className="form-control" onChange={handleChange} type= 'Date' id= 'eventDate' name= 'date' required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor= 'eventDate'> Event Time</label>
                        <input className="form-control" onChange={handleChange} type= 'text' id= 'eventTime' name= 'time' required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor= 'eventAddress'>Address </label>
                        <input className="form-control" onChange={handleChange} type= 'text' id= 'eventAddress' name= 'address' required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor= 'eventDescription'>Description</label>
                        <input className="form-control" onChange={handleChange} type='text' id='eventDescription' name='description' />
                    </div>

                    <input className="btn btn-primary" type= 'submit' value = 'Add Event' />

                    <p>{state.error}</p>
                    <p>{state.success}</p>

                </div>

            </form>
            )
        }else{

            EventForm = <div></div>
        }

    return(
        <div>
            <h2> Events</h2>

            {state.events.map((event) => (

                <div key= {event.name}>
                <Event event={event}/>
                </div>
            ))}

            {AddEventButton}
            {EventForm}

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
)(OrgEventPage);
