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
import { makeSelectUsername, makeSelectLoggedIn, makeSelectMemberStatus } from './selectors';
import reducer from './reducer';
import saga from './saga';
import {Link } from 'react-router-dom'
import Announcement from 'containers/Announcement/Loadable'



const key = 'home';

export function OrgAnnouncementPage({
     org_id,
     MemberStatus,
    }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [state, setState] = useState({org_id: org_id, announcements: [], formShown: false, title: '', content: '', error:''})
  useEffect(() => {
  
    fetch('http://localhost:3000/getAnnouncements', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: org_id
        })
    })
    .then(res => res.json())
    .then(data => setState({...state, announcements: data}))
  }, []);



  const toggleform = ()=>{

    setState({...state, formShown: !state.formShown})

  }

const submitForm = (e)=> {
    e.preventDefault()
    fetch('http://localhost:3000/onAnnouncementSubmit', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({id: state.org_id, title: state.title, content: state.content})
    })
    .then(res => res.json())
    .then(data => {
        if(data.error){
            setState({...state,error: data.error})
        }else if(data.success){
            let newAnnouncements = state.announcements.concat({title: state.title, content: state.content})
            setState({...state, announcements: newAnnouncements, success: data.success})
        }
    })

}

    const handleChange =(e) =>{
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }


    let AddAnnouncementButton
        
    if (MemberStatus === 'Leader'){
        AddAnnouncementButton = <button onClick= {toggleform}>Add Announcement</button>
    }
    else{
        AddAnnouncementButton = <div></div>
    }

    let addAnnouncementForm
    if (state.formShown){
        addAnnouncementForm = (
            <form onSubmit = {submitForm}>
                <div className="formcontent">

                    <div className="form-group">
                        <label htmlFor= 'title'> Title</label>
                        <input className="form-control" onChange={handleChange} value={state.title} type= 'text' id= 'title' name= 'title' required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor= 'content'> Content</label>
                        <input className="form-control" onChange={handleChange} value= {state.content} type= 'text' id= 'content' name= 'content' required/>
                    </div>

                    <input className="btn btn-primary" type= 'submit' value = 'Submit' />

                    <p>{state.error}</p>
                    <p>{state.success}</p>

                    </div>
            </form>
        )
    }
    else{
        addAnnouncementForm = <div></div>
    }

    return(
        <div>
            
            <h2>Annoucements</h2>

            {state.announcements.map((announcement) => (

                <div key= {announcement.title}>
                    <Announcement announcement={announcement}/>
                </div>

    ))}
            {AddAnnouncementButton}
            {addAnnouncementForm}
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
)(OrgAnnouncementPage);
