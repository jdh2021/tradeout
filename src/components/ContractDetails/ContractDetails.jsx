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

  const checkForUserAction = () => {
    console.log('in checkForUserAction', contractDetails.contract_status);
    if(contractDetails.contract_status === 'pending_first_party_response' && contractDetails.first_party_name === user.legal_name) {
      setUserAction(true);
    } else if (contractDetails.contract_status === 'pending_second_party_response' && contractDetails.second_party_name === user.legal_name) {
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
          userAction ? <Typography>needs accept and decline buttons</Typography> : 
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