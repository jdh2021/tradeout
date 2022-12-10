import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import ContractPreview from '../ContractPreview/ContractPreview';
import RecipientViewAcceptDialog from './RecipientViewAcceptDialog.jsx';
import ConfirmDeclineDialog from './ConfirmDeclineDialog.jsx';
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

  // variable and functions for RecipientViewAcceptDialog
  const [openAccepted, setOpenAccepted] = useState(false);

  const handleClickOpenAccepted = () => {
    console.log('in handleClickOpenAccepted');
    setOpenAccepted(true);
  }

  const handleClickCloseAccepted = () => {
    setOpenAccepted(false);
    dispatch({ type: 'SET_CONTRACT_KEY', payload: searchContractKey })
    history.push('/registration');
  }

  // variable and functions for ConfirmDeclineDialog
  const [openConfirmDecline, setOpenConfirmDecline] = useState(false);

  const handleClickOpenConfirmDecline = () => {
    console.log('in handleClickOpenConfirmDecline');
    setOpenConfirmDecline(true);
  }

  const handleClickCloseConfirmDecline = () => {
    setOpenConfirmDecline(false);
  }

  // navigates contract recipient to registration and stores contract key in reducer when "accept" is clicked
  const acceptContract = () => {
    console.log('in acceptContract. Contract key is:', searchContractKey);
    handleClickOpenAccepted();
  }

  // prompts recipient to confirm before contract is declined
  const confirmDecline = () => {
    console.log('in confirmDecline');
    handleClickOpenConfirmDecline();
  };

  // dispatches 'UPDATE_CONTRACT_STATUS' with payload of contract object and function handleContractStatusUpdate
  const declineContract = () => {
    console.log('in declineContract. Contract id to decline is:', contractDetails.id);
    handleClickCloseConfirmDecline();
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
      <Typography variant="h5" color="secondary" sx={{ textAlign: "center" }}>
        {contractDetails.contract_status}
      </Typography>
      <RecipientViewAcceptDialog 
        open={openAccepted}
        handleClickCloseAccepted={handleClickCloseAccepted}
      />
      <ConfirmDeclineDialog 
        handleClickCloseConfirmDecline={handleClickCloseConfirmDecline}
        open={openConfirmDecline}
        declineContract={declineContract}
      />
      <br />
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Recipient View
      </Typography>
      <br />
      <br />
      <ContractPreview contractDetails={contractDetails} />
      <br />
      <br />
      <div>
        {/* conditional checks that contract status is pending and renders Accept, Decline buttons */}
        {contractDetails.contract_status === 'pending_second_party_response' ?
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
          </Box> :
          <></>
        }
      </div>
    </div>
  );
}
export default RecipientView;