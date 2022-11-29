import React, { useState,} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {useSelector} from 'react-redux';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import contractReducer from '../../redux/reducers/contract.reducer';
import ContractCard from '../ContractCard/ContractCard';


function Dashboard() {

  const history = useHistory();
  const user = useSelector((store) => store.user);
  const contracts = useSelector((store) => store.contract);
  



  return (
    <div>
        <h1>Hello, {user.legal_name}</h1>
        <button onClick={() => {history.push(`/create-contract-details`)}}>New Contract</button>

        <h2>Your Accepted Contracts</h2>

        
        <ContractCard contract={contracts}/>




        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="https://images.theconversation.com/files/349961/original/file-20200728-29-6nb8o5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Goat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Goats are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <h2>Pending Contracts</h2>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="https://images.theconversation.com/files/349961/original/file-20200728-29-6nb8o5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Goat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Goats are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <h2>Expired Contracts</h2>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="https://images.theconversation.com/files/349961/original/file-20200728-29-6nb8o5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Goat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Goats are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
    </div>
  );
}
export default Dashboard;