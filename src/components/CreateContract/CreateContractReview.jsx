import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import SummarizeIcon from '@mui/icons-material/Summarize';

const CreateContractReview = () => {

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
        <Breadcrumbs sx={{display: 'flex', justifyContent: 'center'}} separator="|">
          <Typography sx={{display: 'flex', alignItems: 'center', color: '#6622CC'}}>
            <PersonIcon sx={{ mr: 0.5, color: '#6622CC' }} />
            Your Role
          </Typography>
          <Typography underline sx={{display: 'flex', alignItems: 'center', color: '#6622CC'}}>
            <SummarizeIcon sx={{ mr: 0.5, color: '#6622CC' }} />
            Contract Details
          </Typography>
          <Typography sx={{display: 'flex', alignItems: 'center'}}>
            <EditIcon sx={{ mr: 0.5, color: '#6622CC' }} />
            <Typography sx={{fontWeight: '500', color: '#6622CC'}}>Review Details</Typography>
          </Typography>
          <Typography sx={{display: 'flex', alignItems: 'center'}}>
            <SendIcon sx={{ mr: 0.5 }} />
            Submit Contract & Email Recipient
          </Typography>
        </Breadcrumbs>
        <br />
        <Typography variant="h3" sx={{textAlign: "center"}}>Review New Contract Details</Typography>
        <br />
        <br />
        <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <TableContainer elevation={10} component={Paper} sx={{width: 700}}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Contract Title:</Typography></TableCell>
                  <TableCell align="left">{newContractDetails.contractTitle}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Item Name:</Typography></TableCell>
                  <TableCell align="left">{newContractDetails.itemName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Item Description:</Typography></TableCell>
                  <TableCell align="left">{newContractDetails.itemDescription}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Item Price:</Typography></TableCell>
                  <TableCell align="left">${newContractDetails.itemPrice}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Pickup Location:</Typography></TableCell>
                  <TableCell align="left">{newContractDetails.pickupLocation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Pickup Date:</Typography></TableCell>
                  <TableCell align="left">{formattedPickupDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Contract Deadline:</Typography></TableCell>
                  <TableCell align="left">{formattedContractDeadline}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Notes:</Typography></TableCell>
                  <TableCell align="left">{newContractDetails.contractNotes}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Your Signature:</Typography></TableCell>
                  <TableCell align="left">{newContractDetails.firstPartySignature}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 150}} align="left"><Typography>Images:</Typography></TableCell>
                  {/* once image upload is enabled, the img src will be the uploaded image file */}
                  <TableCell align="left"><img src="https://images.unsplash.com/photo-1531104985437-603d6490e6d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1678&q=80" alt="stereo" width="200"/></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <br />
        <br />
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Button 
              variant="contained"
              onClick={(event) => history.push('/create-contract-details')}
              sx={{marginRight: 1, width: 200}}
            >
              Edit Contract Details
            </Button>
            {/* Preview button here */}
            <Button 
              variant="contained"
              onClick={(event) => history.push('/send-to-recipient')}
              sx={{marginLeft: 1, width: 200}}
            >
              Recipient Contact Information
            </Button>
          </Box>
    </div>
  );

}

export default CreateContractReview;