import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import EmailTokenValidationDialog from './EmailTokenValidationDialog.jsx';
import ContractTokenDialog from './ContractTokenDialog.jsx';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import cryptoRandomString from 'crypto-random-string';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import SummarizeIcon from '@mui/icons-material/Summarize';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const SendToRecipient = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const newContractDetails = useSelector(store => store.contract.newContractDetails);
  const user = useSelector((store) => store.user);
  const [tokenCreated, setTokenCreated] = useState(false);
  const imageUpload = useSelector(store => store.contract.newContractDetails.image_data);

  // date formatting for pickup date
  const pickupDate = new Date(newContractDetails.item_pickup_date);
  const formattedPickupDate = pickupDate.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

  // unqiue random string for contract_key
  const token = cryptoRandomString({ length: 40, type: 'hex' });

  // variable and functions for EmailTokenValidationDialog
  const [openEmailTokenValidation, setOpenEmailTokenValidation] = useState(false);

  const handleClickOpenEmailToken = () => {
    setOpenEmailTokenValidation(true);
  }

  const handleClickCloseEmailToken = () => {
    setOpenEmailTokenValidation(false);
  }

  // variable and functions for ContractTokenDialog
  const [openTokenDetails, setOpenTokenDetails] = useState(false);

  const handleClickOpenTokenDetails = () => {
    setOpenTokenDetails(true);
  }

  const handleClickCloseTokenDetails = () => {
    setOpenTokenDetails(false);
  }

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

  // dispatching newContractDetails
  const submitNewContract = () => {
    console.log('in submitNewContract', newContractDetails);
    if (!newContractDetails.second_party_email || !newContractDetails.contract_key) {
      handleClickOpenEmailToken();
      return;
    }
    // the SendGrid email server request is called from within the addNewContract saga
    dispatch({type: 'ADD_NEW_CONTRACT', payload: newContractDetails, fileToUpload: imageUpload, userAlert: userAlert});
    // the SendGrid email server request is called from within the addNewContract saga
    // dispatch({type: 'ADD_NEW_CONTRACT', payload: newContractDetails, userAlert: userAlert});
  }

  // success alert
  const userAlert = () => {
    console.log('in userAlert');
    alert('Your contact has been created, and the recipient has been sent an email inviting them to view the contract details.');
    history.push('/dashboard');
  }

  // explanation of what the contract token is used for
  const contractTokenAlert = () => {
    console.log('in contractTokenAlert');
    alert('The contract token is a unique key that is associated with this contract. The recipient will receive an email with a link to view the details of this contract. The contract token is used in that link to ensure that they access this document securely.')
  }

  // autofill email for demo purposes
  const autofillEmail = () => {
    console.log('in autofillEmail');
    dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, second_party_email: 'jackjackg42@gmail.com'}});
  }

  return (
    <div>
        <Breadcrumbs sx={{display: 'flex', justifyContent: 'center'}} separator="|">
          <Typography sx={{display: 'flex', alignItems: 'center', color: '#6622CC'}}>
            <PersonIcon sx={{ mr: 0.5, color: '#6622CC' }} />
            Your Role
          </Typography>
          <Typography sx={{display: 'flex', alignItems: 'center', color: '#6622CC'}}>
            <SummarizeIcon sx={{ mr: 0.5, color: '#6622CC' }} />
            Contract Details
          </Typography>
          <Typography sx={{display: 'flex', alignItems: 'center', color: '#6622CC'}}>
            <EditIcon sx={{ mr: 0.5, color: '#6622CC' }} />
            Review Details
          </Typography>
          <Typography sx={{display: 'flex', alignItems: 'center', fontWeight: '500', color: '#6622CC'}}>
            <SendIcon sx={{ mr: 0.5, color: '#6622CC' }} />
            Submit Contract & Email Recipient
          </Typography>
        </Breadcrumbs>
        <EmailTokenValidationDialog 
          open={openEmailTokenValidation}
          handleClickCloseEmailToken={handleClickCloseEmailToken}
        />
        <ContractTokenDialog />     
        <br />
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Typography variant="h3">Send to Recipient:</Typography>
          <TextField
            required
            sx={{width: 300, marginLeft: 2}}
            helperText="Enter Recipient's Email"
            label="example@gmail.com"
            value={newContractDetails.second_party_email}
            onChange={handleChangeFor('second_party_email')}
          />
          {/* used to autofill recipient email during demo */}
          <div style={{width: 100, height: 100}} onClick={autofillEmail} />
        </Box>
        <br />
        <br />
        <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Paper elevation={10} sx={{width: 700, padding: 4, display: 'flex', flexDirection: 'column'}}>
            <Typography sx={{textAlign: 'center'}}>Legal Contract for {newContractDetails.contract_title}</Typography>
            <Typography variant="h6" sx={{textAlign: 'center'}}>Bill of Sale</Typography>
            <Typography sx={{textAlign: 'center'}}>THIS BILL OF SALE is executed on {newContractDetails.item_pickup_date} by and between {user.legal_name} (hereinafter referred to as the "{newContractDetails.first_party_type}")</Typography>
            <Typography sx={{textAlign: 'center'}}>and RECIPIENT LEGAL NAME (hereinafter referred to as the "{newContractDetails.second_party_type}").</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>The Seller hereby agrees to transfer to the Buyer all rights of the Seller in the following property:</Typography>
            <Typography sx={{textAlign: 'center'}}>{newContractDetails.item_name}: {newContractDetails.item_description}</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>For and in consideration of a total purchase price of ${newContractDetails.item_price}, an amount agreed upon by the Seller and the Buyer. The form of payment used will be cash and sales tax is included in the purchase price of the above-mentioned property.</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>The Seller hereby affirms that the above information about this property is accurate to the best of their knowledge, and by their signature below certifies they are the lawful owner of the property with the ability to sell it as they see fit.</Typography>
            <Typography sx={{textAlign: 'center'}}>The sale and transfer of property is hereby made on an "AS IS" condition, without any express or implied warranties, with no recourse to the Seller, provided that the Seller can issue proof that they have the title to the property without any liens or encumbrances. The Buyer agrees to accept all property in its existing state.</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>Notes regarding the above property and/or the transaction:</Typography>
            <Typography sx={{textAlign: 'center'}}>{newContractDetails.contract_notes}</Typography>
            <br />
            <Typography sx={{textAlign: 'center'}}>"AS IS" images of the above property provided by the {newContractDetails.first_party_type}:</Typography>
            <br />
            <Box sx={{display: 'flex', justifyContent: 'center', p: 2, border: '1px solid grey' }}>
              {/* images will be the user-uploaded images once that functionality is implemented */}

              <img src={newContractDetails.item_preview}/>

            </Box>
            <br />
            <Typography sx={{textAlign: 'center'}}>The above property will be transferred on: {formattedPickupDate}</Typography>
            <Typography sx={{textAlign: 'center'}}>The Seller and Buyer will meet in {newContractDetails.item_pickup_location} to conduct the transaction for the above property.</Typography>
            <br />
            <Box sx={{ p: 2, border: '1px solid grey' }}>
              <Typography sx={{textAlign: 'center'}}>IN WITNESS THEREOF, the parties execute this Bill of Sale:</Typography>
              <Typography sx={{textAlign: 'center'}}>{newContractDetails.first_party_type} Signature: {newContractDetails.first_party_signature}</Typography>
              <Typography sx={{textAlign: 'center'}}>{newContractDetails.second_party_type} Signature: {newContractDetails.second_party_signature}</Typography>
            </Box>
          </Paper>
      </Container>
      <br />
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Button variant="contained" color="secondary" onClick={() => setContractKey('contract_key', token)} sx={{mr: 2}}>Generate Contract Token*</Button>
        {
          tokenCreated ? <Typography sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>Token created!</Typography> : 
          <Typography sx={{width: 200, display:"flex", alignItems:"center", justifyContent:"center"}}>
            Click to generate contract token for recipient access.
          </Typography>
        }
        <Typography sx={{ml: 2}} onClick={contractTokenAlert}><HelpOutlineIcon /></Typography>
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