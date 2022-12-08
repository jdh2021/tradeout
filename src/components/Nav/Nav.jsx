import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <AppBar position="sticky" className="nav" style={{backgroundColor:'#4BC975'}}>
      <Toolbar disableGutters>
      <Link to="/dashboard">
        <img src="images/tradeout_logo.jpg" alt="tradeout logo" width='150' height='100' style={{margin: 10}}/>
        {/* <h2 className="nav-title">Tradeout</h2> */}
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className="navLink" to="/dashboard">
              <Typography>Dashboard</Typography>
            </Link>

            <Link className="navLink" to="/notifications">
              <Typography>Notifications</Typography>
            </Link>
{/* 
            <Link className="navLink" to="/info">
              Info Page
            </Link> */}

            <LogOutButton className="navLink" />
          </>
        )}

        {/* <Link className="navLink" to="/about">
          About
        </Link> */}
      </div>
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
