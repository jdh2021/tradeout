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
import Breadcrumbs from '@mui/material/Breadcrumbs';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import SummarizeIcon from '@mui/icons-material/Summarize';

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
    if (!newContractDetails.contract_title || !newContractDetails.item_name || !newContractDetails.item_description || !newContractDetails.item_price || !newContractDetails.item_pickup_location || !newContractDetails.item_pickup_date || !newContractDetails.first_party_signature) {
      alert('Please complete all required fields (those with a *).');
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
      contract_title: 'Used Car Purchase',
      item_name: 'Honda Accord',
      item_description: 'year: 2018; color: red; odometer: 53,420 miles; avg. 30 mpg in the city',
      item_price: 10000,
      item_pickup_location: 'St. Paul, MN',
      item_pickup_date: '12/20/2022',
      contract_deadline: '12/18/2022',
      contract_notes: 'payment in cash, new tires as of October 2022 (needed due to a series of punctures), no know mechanical issues',
      first_party_signature: 'Bryn Nadziejka Waller'
    }});
  }

  return (
    <div>
        <Breadcrumbs sx={{display: 'flex', justifyContent: 'center'}} separator="|">
          <Typography sx={{display: 'flex', alignItems: 'center', color: '#6622CC'}}>
            <PersonIcon sx={{ mr: 0.5, color: '#6622CC' }} />
            Your Role
          </Typography>
          <Typography sx={{display: 'flex', alignItems: 'center', fontWeight: '500', color: '#6622CC'}}>
            <SummarizeIcon sx={{ mr: 0.5, color: '#6622CC' }} />
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
        <Typography variant="h3" sx={{textAlign: "center"}}>Create New Contract</Typography>
        <div style={{width: 100, height: 100}} onClick={autofillForm} />
        <br />
        <Typography variant="h6" sx={{textAlign: "center"}}>You are the {newContractDetails.first_party_type}.</Typography>
        <br />
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item sx={{width: 400}}>
            <TextField required fullWidth label="Contract Title" size="small" value={newContractDetails.contract_title} onChange={handleChangeFor('contract_title')}/>
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField required fullWidth label="Item Name" size="small" value={newContractDetails.item_name} onChange={handleChangeFor('item_name')}/>
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField required fullWidth label="Item Description" size="small" value={newContractDetails.item_description} onChange={handleChangeFor('item_description')}/>
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField
              fullWidth 
              required
              label="Item Price" 
              size="small"
              value={newContractDetails.item_price}
              onChange={handleChangeFor('item_price')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              />
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField required fullWidth label="Pickup Location" size="small" value={newContractDetails.item_pickup_location} onChange={handleChangeFor('item_pickup_location')}/>
          </Grid>
          <Grid item sx={{width: 400}}>
            <DatePicker 
              value={newContractDetails.item_pickup_date}
              required
              onChange={(newValue) => handleDate('item_pickup_date', newValue)}
              label="Pickup Date"
              renderInput={(params) => <TextField fullWidth size="small" {...params} />}
              openTo="day"
              views={['year', 'month', 'day']}
            />
          </Grid>
          <Grid item sx={{width: 400}}>
            <DatePicker 
              value={newContractDetails.contract_deadline}
              onChange={(newValue) => handleDate('contract_deadline', newValue)}
              label="Contract Deadline"
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              openTo="day"
              views={['year', 'month', 'day']}
            />
          </Grid>
          <Grid item sx={{width: 400}}>
            <TextField fullWidth label="Notes" size="small" multiline rows={4} value={newContractDetails.contract_notes} onChange={(event) => checkContractNotesLength('contract_notes', event.target.value)}/>
            <Typography>{newContractDetails.contract_notes.length}/600</Typography>
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
            <TextField required fullWidth label="Your Signature" size="small" value={newContractDetails.first_party_signature} onChange={handleChangeFor('first_party_signature')}/>
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