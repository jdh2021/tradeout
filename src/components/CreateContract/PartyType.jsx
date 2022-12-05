import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import SummarizeIcon from '@mui/icons-material/Summarize';

const PartyType = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const newContractDetails = useSelector(store => store.contract.newContractDetails);
  const user = useSelector((store) => store.user);

  const [secondParty, setSecondParty] = useState('');

  // firstPartyType is set in newContractDetails reducer, secondParty is set to opposite of firstPartyType
  const handleChangeFor = (key) => (event) => {
    console.log('in handleChangeFor', event.target.value);
    // secondParty set to the opposite of the firstPartyType
    if (event.target.value === 'Buyer') {
      setSecondParty('Seller');
    } else if (event.target.value === 'Seller') {
      setSecondParty('Buyer');
    }
    // dispatching to newContractDetails reducer
    dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [key]: event.target.value}});
  }

  // secondPartyType is set in newContractDetails reducer, user is pushed to CreateContractDetails
  const handleChangeForSecondParty = (contractDetail, partyType) => {
    console.log('in handleChangeForSecondParty', contractDetail, partyType);
    if (!newContractDetails.first_party_type) {
      alert('Please select whether you are the buyer or seller.');
      return;
    }
    if (partyType === 'Buyer') {
      dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [contractDetail]: 'Buyer'}});
    } else if (partyType === 'Seller') {
      dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [contractDetail]: 'Seller'}});
    }
    // user is pushed to CreateContractDetails
    history.push('/create-contract-details');
  }

  return (
    <div>
        <Breadcrumbs sx={{display: 'flex', justifyContent: 'center'}} separator="|">
          <Typography sx={{display: 'flex', alignItems: 'center', fontWeight: '500', color: '#6622CC'}}>
            <PersonIcon sx={{ mr: 0.5, color: '#6622CC'}} />
            Your Role
          </Typography>
          <Typography sx={{display: 'flex', alignItems: 'center'}}>
            <SummarizeIcon sx={{ mr: 0.5 }} />
            Contract Details
          </Typography>
          <Typography sx={{display: 'flex', alignItems: 'center'}}>
            <EditIcon sx={{ mr: 0.5 }} />
            Review Details
          </Typography>
          <Typography sx={{display: 'flex', alignItems: 'center'}}>
            <SendIcon sx={{ mr: 0.5 }} />
            Submit Contract & Email Recipient
          </Typography>
        </Breadcrumbs>
        <br />
        <Typography variant="h3" sx={{textAlign: "center"}}>Are you a buyer or seller?</Typography>
        <br />
        <br />
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <FormControl>
            <RadioGroup
              value={newContractDetails.firstPartyType}
              onChange={handleChangeFor('first_party_type')}
            >
              <FormControlLabel value="Buyer" control={<Radio />} label="Buyer" />
              <FormControlLabel value="Seller" control={<Radio />} label="Seller" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            {/* when user clicks 'Next' button, the secondPartyType is set and user is pushed to CreateContractDetails */}
            <Button variant="contained" onClick={() => handleChangeForSecondParty('second_party_type', secondParty)}>Next</Button>
          </Grid>
        </Grid>     
    </div>
  );

}

export default PartyType;