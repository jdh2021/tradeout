import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const SendToRecipient = () => {

  const history = useHistory();
  const newContractDetails = useSelector(store => store.contract.newContractDetails);

  // date formatting for pickup date
  const pickupDate = new Date(newContractDetails.pickupDate);
  const formattedPickupDate = pickupDate.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

  // date formatting for contract deadline
  const contractDeadline = new Date(newContractDetails.contractDeadline);
  const formattedContractDeadline = contractDeadline.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

  return (
    <div>
      
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Typography variant="h3">Send to Recipient:</Typography>
          <TextField
            sx={{width: 300, marginLeft: 2}}
            helperText="Enter Recipient's Email"
            label="example@gmail.com"
          />
        </Box>
        <br />
        <br />
        <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Paper elevation={10} variant="outlined" sx={{width: 700, padding: 2, display: 'flex', flexDirection: 'column'}}>
            <Typography sx={{textAlign: 'center'}}>{newContractDetails.contractTitle} Agreement</Typography>
            <Typography sx={{textAlign: 'center'}}></Typography>
          </Paper>
      </Container>
    </div>
  );

}

export default SendToRecipient;