import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import ContractPreview from '../ContractPreview/ContractPreview';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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

  // prompts recipient to confirm before contract is declined
  const confirmDecline = () => {
    console.log('in confirmDecline');
    if (window.confirm('Are you sure you want to decline this contract?')) {
      declineContract();
    }
  };

  // dispatches 'UPDATE_CONTRACT_STATUS' with payload of contract object and function handleContractStatusUpdate
  const declineContract = () => {
    console.log('in declineContract. Contract id to decline is:', contractDetails.id);
    dispatch({
      type: 'UPDATE_CONTRACT_STATUS',
      payload: {
        id: contractDetails.id,
        contract_status: 'declined',
        contract_approval: false,
        second_party_signature: null
      },
      handleContractStatusUpdate
    });
  }

  // passed as part of declineContract, contract by key re-renders in RecipientView with updated status and alerts recipient of successful decline
  const handleContractStatusUpdate = () => {
    console.log('in handleContractStatusUpdate');
    dispatch({ type: 'FETCH_RECIPIENT_CONTRACT', payload: searchContractKey });
    alert('Thank you! The contract has been declined.');
  }

  return (
    <div>
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Recipient View
      </Typography>
      <br />
      <Typography variant="h5" color="secondary" sx={{ textAlign: "center" }}>
        contract {contractDetails.contract_status}
      </Typography>
      <br />
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
            onClick={confirmDecline}
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