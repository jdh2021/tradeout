import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import ContractPreview from '../ContractPreview/ContractPreview';

function ContractDetails() {
  const dispatch = useDispatch();
  const history = useHistory();
  const contractDetails = useSelector(store => store.contract.selectedContract)
  const { contractId } = useParams();
  const user = useSelector(store => store.user);
  // need user reducer in the case we need to pull out the user's email? 
  // const user = useSelector((store) => store.user)

  const [secondPartySignature, setSecondPartySignature] = useState('');

  useEffect(() => {
    dispatch({ type: 'FETCH_CONTRACT_DETAILS', payload: contractId, checkForUserAction: checkForUserAction});
  }, [contractId])

  const [userAction, setUserAction] = useState(false);

  // checking if action is required from the logged in user
  const checkForUserAction = (contractInput) => {
    console.log('in checkForUserAction', contractInput.contract_status);
    if(contractInput.contract_status === 'pending_first_party_response' && contractInput.first_party_name === user.legal_name) {
      setUserAction(true);
    } else if (contractInput.contract_status === 'pending_second_party_response' && contractInput.second_party_name === user.legal_name) {
      setUserAction(true);
    }
  }

  // dispatches 'FINALIZE_CONTRACT' with payload of contract object and the function userAlert
  const finalizeContract = () => {
    console.log('in finalizeContract, second party signature:', secondPartySignature);
    // dispatch to contract saga to update contract details in database
    dispatch({
      type: 'FINALIZE_CONTRACT',
      payload: {
        id: contractDetails.id,
        contract_status: 'accepted',
        contract_approval: true,
        second_party_signature: secondPartySignature
      },
      userAlert
    });
  }

  // alerts user to successful contract finalization and navigates the user to /dashboard
  const userAlert = () => {
    console.log('in userAlert');
    alert('Congratulations! This contract is now finalized. You can download a PDF of the final document by selecting this contract on your Dashboard.')
    history.push('/dashboard');
  }

  return (
    <div>
      {/* page heading. May be a better way to handle this but it will be useful for the user to see the contract status in the heading */}
      <Typography variant="h5" color="secondary" sx={{ textAlign: "center" }}>
        {contractDetails.contract_status} </Typography>

      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Contract Details  </Typography>
      <br />
      <br />


      <ContractPreview 
        contractDetails={contractDetails} 
      />

      <br />
      <br />
        {
          userAction ?  <>
                          <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
                            <Grid item>
                              <TextField required fullWidth label='Your Signature' size='small' sx={{width: 400}} onChange={(event) => setSecondPartySignature(event.target.value)}/> 
                            </Grid>
                          </Grid>
                          <br />
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography sx={{width: 400, display:"flex", alignItems:"center", justifyContent:"center"}}>By typing your name, you are agreeing that your typed signature has the same authority as a handwritten signature.</Typography>
                          </Box>
                          <br />
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                              variant="contained"
                              // onClick to update contract_status to 'accepted' and add second party signature, trigger PDF generation, and show success alert to user
                              onClick={(event) => finalizeContract()}
                              sx={{ marginRight: 1, width: 200, height: 60 }}
                            >
                              Sign and Finalize Contract
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              // onClick to update contract_status to 'declined', trigger a declined contract confirmation alert, and return user to /dashboard
                              sx={{ marginLeft: 1, width: 200, height: 60 }}
                            >
                              Decline Contract
                            </Button> 
                          </Box>
                      </> : 
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          onClick={(event) => history.push('/dashboard')}
                          sx={{ marginRight: 1, width: 200 }}
                        >
                          Back to Dashboard
                        </Button>
                      </Box>
        }
    </div>
  );
}
export default ContractDetails;