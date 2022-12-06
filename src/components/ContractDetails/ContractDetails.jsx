import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';

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

  useEffect(() => {
    dispatch({ type: 'FETCH_CONTRACT_DETAILS', payload: contractId, checkForUserAction: checkForUserAction});
  }, [contractId])

  const [userAction, setUserAction] = useState(false);

  const checkForUserAction = (contractInput) => {
    console.log('in checkForUserAction', contractInput.contract_status);
    if(contractInput.contract_status === 'pending_first_party_response' && contractInput.first_party_name === user.legal_name) {
      setUserAction(true);
    } else if (contractInput.contract_status === 'pending_second_party_response' && contractInput.second_party_name === user.legal_name) {
      setUserAction(true);
    }
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


      <ContractPreview contractDetails={contractDetails} />

      <br />
      <br />

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {
          userAction ?  <div>
                          <Button
                            variant="contained"
                            // onClick to update contract_status to 'accepted' and trigger PDF generation
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
                      </div> : 
          <Button
            variant="contained"
            onClick={(event) => history.push('/dashboard')}
            sx={{ marginRight: 1, width: 200 }}
          >
            Back to Dashboard
          </Button>
        }

      </Box>



    </div>
  );
}
export default ContractDetails;