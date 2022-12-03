import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import ContractPreview from '../ContractPreview/ContractPreview';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function RecipientView() {
  const history = useHistory();
  const dispatch = useDispatch();
  // client-side URL param, corresponds to route exact path in App.jsx
  const { searchContractKey } = useParams();
  const contractDetails = useSelector(store => store.contract.selectedContract)

  // dispatches FETCH_RECIPIENT_CONTRACT whenever searchContractKey changes
  useEffect(() => {
    dispatch({ type: 'FETCH_RECIPIENT_CONTRACT', payload: searchContractKey });
  }, [searchContractKey]);

  // navigates contract recipient to registration and stores contract key in reducer when "accept" is clicked
  const acceptContract = () => {
    console.log('in acceptContract. Contract key is:', searchContractKey);
    alert('You\'ll now be routed to registration where you can register as a TradeOut user and accept this contract.');
    dispatch({ type: 'SET_CONTRACT_KEY', payload: searchContractKey })
    history.push('/registration');
  }

  return (
    <div>
      <h1>RecipientView</h1>
      <ContractPreview contractDetails={contractDetails} />
      <div>
        <br></br>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={acceptContract}
            sx={{ marginRight: 1, width: 200 }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            sx={{ marginLeft: 1, width: 200 }}
          >
            Decline
          </Button>
        </Box>
      </div>
    </div>
  );
}
export default RecipientView;