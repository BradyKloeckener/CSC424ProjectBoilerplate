/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { changeLoginStatus} from './actions';
import { makeSelectLoggedIn } from './selectors';
import reducer from './reducer';
import saga from './saga';
import RenderOrgCards from 'containers/RenderOrgCards/Loadable'


const key = 'home';

export function GetUserOrgs({
  loggedIn,
  onChangeLoginStatus,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [state, setState] = useState({orgs:[] })

  useEffect(() => {

    fetch('http://localhost:3000/getUserOrgs',{method: 'POST'})
        .then(res => res.json())
        .then(data =>{
            setState({...state, orgs: data})
        })
  }, []);


  if(state.orgs.length === 0){
    return(
        <p>You have not joined any orgaizations or clubs yet! Check out the Browse Organizations Page to find organizations to join or create your own organization</p>
    )
  }
  return(
      <div>  
          <RenderOrgCards orgs= {state.orgs}/>    
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
});

export function mapDispatchToProps(dispatch) {
  return {
   // onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
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
)(GetUserOrgs);
