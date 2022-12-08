import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

function Nav() {
  const user = useSelector((store) => store.user);

  const drawerWidth = 240;

  return (
    <AppBar position="sticky" className="nav" style={{backgroundColor:'#4BC975'}}>
      <Toolbar disableGutters>
        <Box container sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
        <Link to="/dashboard">
          <img src="images/tradeout_logo.jpg" alt="tradeout logo" width='175' height='125' style={{margin: 10, borderRadius: 4}}/>
        </Link>
        <div>
          {/* If no user is logged in, show these links */}
          {!user.id && (
            // If there's no user, show login/registration links
            <Link className="navLink" to="/login">
              <Typography sx={{display: 'flex', alignItems: 'center'}} variant="h6"><LoginRoundedIcon sx={{mr: 1}}/>Login / Register</Typography>
            </Link>
          )}

          {/* If a user is logged in, show these links */}
          {user.id && (
            <>
              <Link className="navLink" to="/dashboard">
                <Typography sx={{display: 'flex', alignItems: 'center'}} variant="h6"><HomeRoundedIcon sx={{mr: 1}}/>Dashboard</Typography>
              </Link>

              <Link className="navLink" to="/notifications">
                <Typography sx={{display: 'flex', alignItems: 'center'}} variant="h6"><NotificationsActiveRoundedIcon sx={{mr: 1}}/>Notifications</Typography>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
