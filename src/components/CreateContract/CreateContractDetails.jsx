import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';

const CreateContractDetails = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const newContractDetails = useSelector(store => store.contract.newContractDetails);

  const handleChangeFor = (key) => (event) => {
    dispatch({ type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [key]: event.target.value}});
  }

  return (
    <div>
        <Typography variant="h3" sx={{textAlign: "center"}}>Create New Contract</Typography>
        <br />
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <TextField  label="Contract Title" size="small" value={newContractDetails.contractTitle} onChange={handleChangeFor('contractTitle')}/>
          </Grid>
          <Grid item>
            <TextField  label="Item Name" size="small" value={newContractDetails.itemName} onChange={handleChangeFor('itemName')}/>
          </Grid>
          <Grid item>
            <TextField  label="Item Description" size="small" value={newContractDetails.itemDescription} onChange={handleChangeFor('itemDescription')}/>
          </Grid>
          <Grid item>
            <TextField  
              label="Item Price" 
              size="small"
              value={newContractDetails.itemPrice}
              onChange={handleChangeFor('itemPrice')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              />
          </Grid>
          <Grid item>
            <TextField  label="Pickup Location" size="small" value={newContractDetails.pickupLocation} onChange={handleChangeFor('pickupLocation')}/>
          </Grid>
          <Grid item>
            <TextField  label="Pickup Date" size="small" value={newContractDetails.pickupDate} onChange={handleChangeFor('pickupDate')}/>
          </Grid>
          <Grid item>
            <TextField  label="Contract Deadline" size="small" value={newContractDetails.contractDeadline} onChange={handleChangeFor('contractDeadline')}/>
          </Grid>
          <Grid item>
            <TextField  label="Notes" size="small" multiline rows={4} value={newContractDetails.contractNotes} onChange={handleChangeFor('contractNotes')}/>
          </Grid>
          <Grid item>
            {/* the upload button does not work */}
            <Button variant="contained">Upload Item Image</Button>
          </Grid>
          <Grid item>
            <TextField  label="Your Signature" size="small" value={newContractDetails.firstPartySignature} onChange={handleChangeFor('firstPartySignature')}/>
          </Grid>
          <br />
          <Box>
            <Grid item sx={{justifyContent: 'center', maxWidth: 400}}>
              <Typography>By typing your name, you are agreeing that your typed signature has the same authority as a handwritten signature.</Typography>
            </Grid>
          </Box>
          <br />
          <Button variant="contained" onClick={() => history.push('/create-contract-review')}>Review Contract</Button>  
        </Grid>
    </div>
  );
}

export default CreateContractDetails;