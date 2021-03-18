/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Route, Routes} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import HomePage from 'containers/HomePage/Loadable';
import NavBar from 'containers/NavBar/Loadable';
import UserOrgsPage from 'containers/UserOrgsPage/Loadable';
import RegisterOrgPage from 'containers/RegisterOrgPage/Loadable'
import UserProfile from 'containers/UserProfile/Loadable'
import BrowsePage from 'containers/BrowsePage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable'
import SignUpPage from 'containers/SignUpPage/Loadable'
import OrgPageElements from 'containers/OrgPageElements/Loadable'
// import FeaturePage from 'containers/FeaturePage/Loadable';
// import NotFoundPage from 'containers/NotFoundPage/Loadable';


import GlobalStyle from '../../global-styles';




const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <NavBar/>
      <Routes>
          <Route path= '/' exact element= {<HomePage/>} /> 
          <Route path= '/orgs' element= {<UserOrgsPage/>} />
          <Route path= '/registerOrg' element= {<RegisterOrgPage/>} />
          <Route path= '/profile' element= {<UserProfile/>} /> 
          <Route path= '/browse' element= {<BrowsePage/>} /> 
          <Route path= '/login' element= {<LoginPage/>} /> 
          <Route path= '/signup' element= {<SignUpPage/>} /> 
          <Route path= '/organization/:org_id' element= {<OrgPageElements/>} /> 
      </Routes>
      <GlobalStyle />
    </AppWrapper>
  );
}
