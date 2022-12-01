import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

function ContractDetails() {
  const dispatch = useDispatch();
  const history = useHistory();
  const contractDetails = useSelector(store => store.contract.selectedContract)
  const { contractId } = useParams();
  // need user reducer in the case we need to pull out the user's email? 
  // const user = useSelector((store) => store.user)

  useEffect(() => {
    dispatch({ type: 'FETCH_CONTRACT_DETAILS', payload: contractId })
  }, [contractId])

  //format dates on contract 

  const dateContractCreation = new Date(contractDetails.contract_created_at);
  const formattedContractCreationDate = dateContractCreation.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });


  const pickupDate = new Date(contractDetails.item_pickup_date);
  const formattedPickupDate = pickupDate.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

  const deadlineDate = new Date(contractDetails.contract_deadline);
  const formattedDeadlineDate = deadlineDate.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });








  return (
    <div>
      {/* page heading. May be a better way to handle this but it will be useful for the user to see the contract status in the heading */}
      <Typography variant="h5" color="secondary" sx={{ textAlign: "center" }}>
        {contractDetails.contract_status} </Typography>

      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Contract Details  </Typography>
      <br />
      <br />

      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TableContainer elevation={10} component={Paper} sx={{ width: 700 }}>
          <Table>
            <TableBody>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Contract Title:</Typography></TableCell>
                <TableCell align="left">{contractDetails.contract_title}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Date of Contract Creation:</Typography></TableCell>
                <TableCell align="left">{formattedContractCreationDate}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Item Name:</Typography></TableCell>
                <TableCell align="left">{contractDetails.item_name}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Item Description:</Typography></TableCell>
                <TableCell align="left">{contractDetails.item_description}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Item Price:</Typography></TableCell>
                <TableCell align="left">${contractDetails.item_price}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Pickup Location:</Typography></TableCell>
                <TableCell align="left">{contractDetails.item_pickup_location}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Pickup Date:</Typography></TableCell>
                <TableCell align="left">{formattedPickupDate}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Contract Deadline:</Typography></TableCell>
                <TableCell align="left">{formattedDeadlineDate}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Notes:</Typography></TableCell>
                <TableCell align="left">{contractDetails.contract_notes}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Your Signature:</Typography></TableCell>
                <TableCell align="left">{contractDetails.first_party_signature}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Second Party's Signature:</Typography></TableCell>
                <TableCell align="left">{contractDetails.second_party_signature}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: 150 }} align="left">
                  <Typography>Images:</Typography></TableCell>

                {/* once image upload is enabled, the img src will be the uploaded image file */}
                <TableCell align="left">
                  <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=webp&v=1530129081"
                    alt="image-placeholder" width="200" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <br />
      <br />

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={(event) => history.push('/dashboard')}
          sx={{ marginRight: 1, width: 200 }}
        >
          Back to Dashboard
        </Button>
      </Box>



    </div>
  );
}
export default ContractDetails;