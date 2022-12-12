import React, { useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {useSelector, useDispatch} from 'react-redux';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ContractCard from '../ContractCard/ContractCard';

function Dashboard() {

  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const userContracts = useSelector((store) => store.contract.userContracts);
  

  useEffect(() => {
    dispatch({ type: 'FETCH_CONTRACTS' });
  }, [dispatch]);

  return (
    <Container>
        <Typography variant="h3">Hello, {user.email}</Typography>
        <br />
        <Button variant="contained" color="green" onClick={() => {history.push(`/party-type`)}}>New Contract</Button>
        <br />
        <br />
        <Typography variant="h5">Accepted Contracts</Typography>
        <Grid container direction="row">
          {userContracts.map(contract => {
            //renders accepted contracts
            if (contract.contract_status === 'accepted')
              return  <Grid item>
                        <ContractCard contract={contract} key={contract.id}/>
                      </Grid>
          })}
        </Grid>
        <br />
        <Typography variant="h5" >Pending Contracts</Typography>
        <Grid container direction="row">
          {userContracts.map(contract => {
            //renders pending contracts
            if (contract.contract_status === 'pending_second_party_response')
              return  <Grid item> 
                        <ContractCard contract={contract} key={contract.id}/>
                      </Grid>
          })}
        </Grid>
        <br />
        <Typography variant="h5">Declined Contracts</Typography>

        <Grid container direction="row">
          {userContracts.map(contract => {
            //renders declined contracts
            if (contract.contract_status === 'declined')
              return  <Grid item>
                        <ContractCard contract={contract} key={contract.id}/>
                      </Grid>
          })}
        </Grid>


    </Container>
  );
}
export default Dashboard;