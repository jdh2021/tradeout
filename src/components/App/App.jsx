import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import RecipientView from '../RecipientView/RecipientView';
import Dashboard from '../Dashboard/Dashboard.jsx';
import ContractDetails from '../ContractDetails/ContractDetails.jsx';
import Notifications from '../Notifications/Notifications.jsx';
import CounterOfferEdits from '../CounterOffer/CounterOfferEdits.jsx';
import CounterOfferReview from '../CounterOffer/CounterOfferReview.jsx';
import ContractRecipientAccess from '../ContractRecipientAccess/ContractRecipientAccess';
import CreateContractDetails from '../CreateContract/CreateContractDetails.jsx';
import CreateContractReview from '../CreateContract/CreateContractReview.jsx';
import PartyType from '../CreateContract/PartyType.jsx';
import SendToRecipient from '../CreateContract/SendToRecipient.jsx';

import ContractComparison from '../ContractComparison/ContractComparison.jsx';
import FinalContract from '../ContractAccepted/FinalContract.jsx';
import ReviewAndSign from '../ContractAccepted/ReviewAndSign.jsx';
import './App.css';

// imports for MUI date picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function App() {
  const dispatch = useDispatch();

  const user = useSelector(store => store.user);


  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
    dispatch({ type: 'FETCH_CONTRACTS' })
  }, [dispatch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/dashboard" />

            {/* Visiting localhost:3000/about will show the about page. */}
            <Route
              // shows AboutPage at all times (logged in or not)
              exact
              path="/about"
            >
              <AboutPage />
            </Route>

            {/* For protected routes, the view could show one of several things on the same route.
              Visiting localhost:3000/user will show the UserPage if the user is logged in.
              If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
              Even though it seems like they are different pages, the user is always on localhost:3000/user */}
            <ProtectedRoute
              // logged in shows UserPage else shows LoginPage
              exact
              path="/user"
            >
              <UserPage />
            </ProtectedRoute>

            <ProtectedRoute
              // logged in shows InfoPage else shows LoginPage
              exact
              path="/info"
            >
              <InfoPage />
            </ProtectedRoute>

        


          {/* NEW COMPONENT PROTECTED ROUTES */}
          <ProtectedRoute 
            exact path = "/dashboard"
          >
            <Dashboard />
          </ProtectedRoute>
          
          <ProtectedRoute 
            exact path="/contract-details"
          >
            <ContractDetails />
          </ProtectedRoute>

          <ProtectedRoute 
          exact path="/notifications"
          >
            <Notifications />
          </ProtectedRoute>

          <ProtectedRoute 
            exact path="/counter-offer-edits"
          >
            <CounterOfferEdits />
          </ProtectedRoute>

          <ProtectedRoute 
            exact path="/counter-offer-review"
          >
            <CounterOfferReview />
          </ProtectedRoute>
    
          <ProtectedRoute
            exact path="/create-contract-details"
          >
            <CreateContractDetails />
          </ProtectedRoute> 
          
          <ProtectedRoute
            exact path="/create-contract-review"
          >
            <CreateContractReview />
          </ProtectedRoute> 

          <ProtectedRoute
            exact path="/party-type"
          >
            <PartyType />
          </ProtectedRoute> 

          <ProtectedRoute
            exact path="/send-to-recipient"
          >
            <SendToRecipient />
          </ProtectedRoute> 

          <ProtectedRoute
            exact
            path="/contract-comparison"
          >
            <ContractComparison />
          </ProtectedRoute>

          <ProtectedRoute
            path="/final-contract"
            >
              <FinalContract />
          </ProtectedRoute>

          <ProtectedRoute
              path="/review-and-sign"
            >
              <ReviewAndSign />
          </ProtectedRoute>
          
          {/* ----------------------- */}
          
            <Route
              exact
              path="/login"
            >
              {user.id ?
                // If the user is already logged in, 
                // redirect to the /user page
                <Redirect to="/user" />
                :
                // Otherwise, show the login page
                <LoginPage />
              }
            </Route>

            <Route
              exact
              path="/registration"
            >
              {user.id ?
                // If the user is already logged in, 
                // redirect them to the /user page
                <Redirect to="/user" />
                :
                // Otherwise, show the registration page
                <RegisterPage />
              }
            </Route>

            <Route
              exact
              path="/home"
            >
              {user.id ?
                // If the user is already logged in, 
                // redirect them to the /user page
                <Redirect to="/user" />
                :
                // Otherwise, show the Landing page
                <LandingPage />
              }
            </Route>

            {/* NEW COMPONENT UNPROTECTED ROUTES */}
            <Route
              exact
              path="/contract-recipient-access"
            >
              <ContractRecipientAccess />
            </Route>

            <Route
              exact path="/recipient-view"
            >
              <RecipientView />
            </Route>
          {/* ----------------------- */}

            {/* If none of the other routes matched, we will show a 404. */}
            <Route>
              <h1>404</h1>
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
