import React, { useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {useSelector, useDispatch} from 'react-redux';

import Grid from '@mui/material/Grid';
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
    <div>
        <h1>Hello, {user.email}</h1>
        
        <button onClick={() => {history.push(`/party-type`)}}>New Contract</button>

        <h2>Accepted Contracts</h2>

        <Grid container direction="row">
          {userContracts.map(contract => {
            //renders accepted contracts
            if (contract.contract_status === 'accepted')
              return  <Grid item>
                        <ContractCard contract={contract} key={contract.id}/>
                      </Grid>
          })}
        </Grid>

        <h2 >Pending Contracts</h2>

        <Grid container direction="row">
          {userContracts.map(contract => {
            //renders pending contracts
            if (contract.contract_status === 'pending_second_party_response')
              return  <Grid item> 
                        <ContractCard contract={contract} key={contract.id}/>
                      </Grid>
          })}
        </Grid>

        <h2>Declined Contracts</h2>

        <Grid container direction="row">
          {userContracts.map(contract => {
            //renders declined contracts
            if (contract.contract_status === 'declined')
              return  <Grid item>
                        <ContractCard contract={contract} key={contract.id}/>
                      </Grid>
          })}
        </Grid>


    </div>
  );
}
export default Dashboard;