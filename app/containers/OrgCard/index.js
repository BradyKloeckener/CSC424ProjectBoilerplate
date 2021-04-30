import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { makeSelectLoggedIn } from '../NavBar/selectors';
import { Link } from 'react-router-dom'
import '../css/OrgCard.css'

const key = 'home';

export function OrgCard({

  loggedIn,
  id,
  name,
  location,
  
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {

  }, []);


  let path = '/organization/' + id + '/orgHome'


        return(
            <div id='OrgCardDiv' className="card">
            <nav>
                <Link to= {path} >
                <div className="card-body">
                    <h3 className="card-title"> {name} </h3>
                    <p className="card-text"> {location} </p>
                </div>
                </Link>
            </nav>
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

  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(OrgCard);
