import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import cryptoRandomString from 'crypto-random-string';

const SendToRecipient = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const newContractDetails = useSelector(store => store.contract.newContractDetails);
  const user = useSelector((store) => store.user);
  const [tokenCreated, setTokenCreated] = useState(false);

  // date formatting for pickup date
  const pickupDate = new Date(newContractDetails.pickupDate);
  const formattedPickupDate = pickupDate.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

  // unqiue random string for contract_key
  const token = cryptoRandomString({ length: 64, type: 'hex' });

  // defining the value of contract_key in newContractDetails reducer
  const setContractKey = (key, value) => {
    console.log('in setContractKey', key, value);
    setTokenCreated(true);
    dispatch({ type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [key]: value}});
  }

  // onChange in a textfield, the key value is set in the newContractDetails reducer
  const handleChangeFor = (key) => (event) => {
    console.log('in handleChangeFor');
    dispatch({ type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [key]: event.target.value}});
  }

  // dispatching newContractDetails and the SendGrid email function to the addNewContract saga
  const submitNewContract = () => {
    console.log('in submitNewContract', newContractDetails);
    // the SendGrid email function will be passed in the dispatch after the payload
    dispatch({type: 'ADD_NEW_CONTRACT', payload: newContractDetails});
  }

  // SendGrid email function that fires from the addNewContract saga

  return (
    <div>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Typography variant="h3">Send to Recipient:</Typography>
          <TextField
            sx={{width: 300, marginLeft: 2}}
            helperText="Enter Recipient's Email"
            label="example@gmail.com"
            value={newContractDetails.secondPartyEmail}
            onChange={handleChangeFor('secondPartyEmail')}
          />
        </Box>
        <br />
        <br />
        <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Paper elevation={10} sx={{width: 700, padding: 2, display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h6" sx={{textAlign: 'center'}}>{newContractDetails.contractTitle} Agreement</Typography>
            {/* user.username will be changed to user.legalName when registration/login is working */}
            <Typography sx={{textAlign: 'center'}}>{user.username} (the "{newContractDetails.firstPartyType}") does hereby sell, assign, and transfer to</Typography>
            <Typography sx={{textAlign: 'center'}}>*recipient legal name* (the "{newContractDetails.secondPartyType}") the following property:</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>{newContractDetails.itemName}: {newContractDetails.itemDescription}</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>for a TOTAL AMOUNT OF ${newContractDetails.itemPrice}</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>The seller warrants that they are the legal owner of the property and that it is being transferred to the buyer free and clear of any liens or encumbrances.</Typography>
            <Typography sx={{textAlign: 'center'}}>The above property is sold on an "AS IS" basis. The seller makes no warranites, express or implied (except as specially stated in this document).</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>Notes regarding the above property:</Typography>
            <Typography sx={{textAlign: 'center'}}>{newContractDetails.contractNotes}</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>"AS IS" images of the above property provided by the seller:</Typography>
            <br />
            <Box sx={{display: 'flex', justifyContent: 'center', p: 2, border: '1px solid grey' }}>
              {/* images will be the user-uploaded images once that functionality is implemented */}
              <img src="https://images.unsplash.com/photo-1531104985437-603d6490e6d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1678&q=80" alt= "stereo" width="200"/>
            </Box>
            <br />
            <Typography sx={{textAlign: 'center'}}>The above property will be transferred on: {formattedPickupDate}</Typography>
            <Typography sx={{textAlign: 'center'}}>The seller and buyer will meet in {newContractDetails.pickupLocation} to transfer the above property.</Typography>
            <br />
            <Box sx={{ p: 2, border: '1px solid grey' }}>
              <Typography sx={{textAlign: 'center'}}>{newContractDetails.firstPartyType} Signature: {newContractDetails.firstPartySignature}</Typography>
              <Typography sx={{textAlign: 'center'}}>{newContractDetails.secondPartyType} Signature: {newContractDetails.secondPartySignature}</Typography>
            </Box>
          </Paper>
      </Container>
      <br />
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Button variant="contained" color="secondary" onClick={() => setContractKey('contractKey', token)} sx={{mr: 2}}>Generate Contract Token</Button>
        {
          tokenCreated ? <Typography sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>Created!</Typography> : 
          <Typography sx={{width: 200, display:"flex", alignItems:"center", justifyContent:"center"}}>
            Click to generate contract token for recipient access.
          </Typography>
        }
      </Box>
      <br />
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Button 
              variant="contained"
              onClick={() => history.push('/create-contract-review')}
              sx={{marginRight: 1, width: 200}}
            >
              Review Contract Details
            </Button>
            <Button 
              variant="contained"
              // add onClick function that dispatches to new contract POST saga
              onClick={submitNewContract}
              sx={{marginLeft: 1, width: 200}}
            >
              Create Contract and Send to Recipient
            </Button>
          </Box>
    </div>
  );

}

export default SendToRecipient;