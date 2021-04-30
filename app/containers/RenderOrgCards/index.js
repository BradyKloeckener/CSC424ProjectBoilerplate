/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';

import { changeUsername } from './actions';
import { makeSelectLoggedIn } from './selectors';
import reducer from './reducer';
import saga from './saga';
import OrgCard from 'containers/OrgCard/Loadable'


const key = 'home';

export function RenderOrgCards({

  loggedIn,
  orgs
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {

  }, []);

 
  return( 
        
    <div className="orgCard">
        {orgs.map((org) => (

                <div key= {org._id}>
                    <OrgCard id={org._id} name={org.name} location= {org.location} />
                </div>

        ))}
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
   // onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
     // dispatch(loadRepos());
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
)(RenderOrgCards);
