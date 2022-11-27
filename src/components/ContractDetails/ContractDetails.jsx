import { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  const contractDetails = useSelector(store => store.selectedContract)
  const { contractId } = useParams();

  useEffect(() => {
    dispatch({ type: 'FETCH_CONTRACT_DETAILS', payload: contractId })
  })

  //format dates on contract 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

  return (
    <div>
      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TableContainer elevation={10} component={Paper} sx={{ width: 700 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Contract Title:</Typography></TableCell>
                <TableCell align="left">{selectedContract.contractTitle}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Item Name:</Typography></TableCell>
                <TableCell align="left">{selectedContract.itemName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Item Description:</Typography></TableCell>
                <TableCell align="left">{selectedContract.itemDescription}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Item Price:</Typography></TableCell>
                <TableCell align="left">${selectedContract.itemPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Pickup Location:</Typography></TableCell>
                <TableCell align="left">{selectedContract.pickupLocation}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Pickup Date:</Typography></TableCell>
                <TableCell align="left">{formatDate(selectedContract.pickupDate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Contract Deadline:</Typography></TableCell>
                <TableCell align="left">{selectedContract.deadline}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Notes:</Typography></TableCell>
                <TableCell align="left">{selectedContract.contractNotes}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Your Signature:</Typography></TableCell>
                <TableCell align="left">{selectedContract.firstPartySignature}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Second Party's Signature:</Typography></TableCell>
                <TableCell align="left">{selectedContract.secondPartySignature}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 150 }} align="left"><Typography>Images:</Typography></TableCell>
                {/* once image upload is enabled, the img src will be the uploaded image file */}
                <TableCell align="left">
                  <img src="https://i.ebayimg.com/images/g/ZUkAAOSw0x1jd7sn/s-l500.jpg"
                    alt="guitar"
                    width="200" /></TableCell>
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

      {/* <pre>{JSON.stringify(selectedContract)}</pre> */}

    </div>
  );
}
export default ContractDetails;