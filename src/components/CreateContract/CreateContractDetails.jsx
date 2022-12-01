import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CreateContractDetails = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const newContractDetails = useSelector(store => store.contract.newContractDetails);

  // onChange in a textfield, the key value is set in the newContractDetails reducer
  const handleChangeFor = (key) => (event) => {
    console.log('in handleChangeFor');
    dispatch({ type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [key]: event.target.value}});
  }

  // sets the key value in newContractDetails reducer for the pickup date and contract deadline  
  const handleDate = (key, date) => {
    console.log('in handleDate', key, date);
    dispatch({ type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [key]: date}});
  }

  // checks length of the notes entry, alerts the user if the notes are longer than 600 char (database char max = 600)
  const checkContractNotesLength = (key, contractNotes) => {
    console.log('in checkLength');
    if(contractNotes.length <= 600) {
      dispatch({ type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [key]: contractNotes}});
    } else {
        alert('Contract notes cannot be more than 600 characters.');
    }
  }

  // validating that the required fields have a value
  const validateForm = () => {
    console.log('in validateForm');
    if (!newContractDetails.contractTitle || !newContractDetails.itemName || !newContractDetails.itemDescription || !newContractDetails.itemPrice || !newContractDetails.pickupLocation || !newContractDetails.pickupDate || !newContractDetails.firstPartySignature) {
      alert('Please completed all required fields (those with a *).');
      return;
    } else {
      history.push('/create-contract-review');
    }
  }

  // filling the form textfields for demo purposes
  const autofillForm = () => {
    console.log('in autofillForm');
    dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {
      ...newContractDetails, 
      contractTitle: 'Car Purchase',
      itemName: 'Honda Accord',
      itemDescription: '2008, blue',
      itemPrice: 1500,
      pickupLocation: 'St. Paul, MN',
      pickupDate: '12/15/2022',
      contractDeadline: '12/13/2022',
      contractNotes: 'payment in cash, new tires as of October 2022, no know mechanical issues',
      firstPartySignature: 'Eliot Winter'
    }});
  }

  return (
    <div>
        <Typography variant="h3" sx={{textAlign: "center"}}>Create New Contract</Typography>
        <div style={{width: 100}} onClick={autofillForm}><h5>magic button</h5></div>
        <br />
        <Typography variant="h6" sx={{textAlign: "center"}}>You are the {newContractDetails.firstPartyType}.</Typography>
        <br />
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item sx={{width: 400}}>
            <TextField required fullWidth label="Contract Title" size="small" value={newContractDetails.contractTitle} onChange={handleChangeFor('contractTitle')}/>
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField required fullWidth label="Item Name" size="small" value={newContractDetails.itemName} onChange={handleChangeFor('itemName')}/>
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField required fullWidth label="Item Description" size="small" value={newContractDetails.itemDescription} onChange={handleChangeFor('itemDescription')}/>
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField
              fullWidth 
              required
              label="Item Price" 
              size="small"
              value={newContractDetails.itemPrice}
              onChange={handleChangeFor('itemPrice')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              />
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField required fullWidth label="Pickup Location" size="small" value={newContractDetails.pickupLocation} onChange={handleChangeFor('pickupLocation')}/>
          </Grid>
          <Grid item sx={{width: 400}}>
            <DatePicker 
              value={newContractDetails.pickupDate}
              required
              onChange={(newValue) => handleDate('pickupDate', newValue)}
              label="Pickup Date"
              renderInput={(params) => <TextField fullWidth size="small" {...params} />}
              openTo="day"
              views={['year', 'month', 'day']}
            />
          </Grid>
          <Grid item sx={{width: 400}}>
            <DatePicker 
              value={newContractDetails.contractDeadline}
              onChange={(newValue) => handleDate('contractDeadline', newValue)}
              label="Contract Deadline"
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              openTo="day"
              views={['year', 'month', 'day']}
            />
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField fullWidth label="Notes" size="small" multiline rows={4} value={newContractDetails.contractNotes} onChange={(event) => checkContractNotesLength('contractNotes', event.target.value)}/>
            <Typography>{newContractDetails.contractNotes.length}/600</Typography>
          </Grid>
          <br />
          <Grid item>
            {/* the upload button does not work */}
            {/* <Button variant="contained">Upload Item Image</Button> */}
            <h4>Upload Item Image</h4>
            <input type="file" name="picture"></input>
          </Grid>
          <br />
          <Grid item sx={{width: 400}}>
            <TextField required fullWidth label="Your Signature" size="small" value={newContractDetails.firstPartySignature} onChange={handleChangeFor('firstPartySignature')}/>
          </Grid>
          <br />
          <Box>
            <Grid item sx={{justifyContent: 'center', textAlign: 'justify', maxWidth: 400}}>
              <Typography>By typing your name, you are agreeing that your typed signature has the same authority as a handwritten signature.</Typography>
            </Grid>
          </Box>
          <br />
          {/* <Button variant="contained" onClick={() => history.push('/create-contract-review')}>Review Contract</Button>   */}
        </Grid>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Button 
              variant="contained"
              onClick={(event) => history.push('/party-type')}
              sx={{marginRight: 1, width: 200}}
            >
              Edit Party Type
            </Button>
            {/* Preview button here */}
            <Button 
              variant="contained"
              onClick={validateForm}
              sx={{marginLeft: 1, width: 200}}
            >
              Review Contract
            </Button>
          </Box>
    </div>
  );
}

export default CreateContractDetails;