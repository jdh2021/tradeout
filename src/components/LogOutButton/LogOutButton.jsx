import React from 'react';
import { useDispatch } from 'react-redux';

import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

function LogOutButton(props) {
  const dispatch = useDispatch();
  return (
    <button
      // This button shows up in multiple locations and is styled differently
      // because it's styled differently depending on where it is used, the className
      // is passed to it from it's parents through React props
      className={props.className}
      onClick={() => dispatch({ type: 'LOGOUT' })}
    >
      <Typography sx={{display: 'flex', alignItems: 'center'}} variant="h6"><LogoutRoundedIcon sx={{mr: 1}}/>Log Out</Typography>
    </button>
  );
}

export default LogOutButton;
