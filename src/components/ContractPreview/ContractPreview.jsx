
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
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name TemplateFunction with the name for the new component.
function ContractPreview({contractDetails, userAction}) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const store = useSelector((store) => store);
  const [heading, setHeading] = useState('Functional Component');

    //format dates on contract 

  const formattedDate = (input) => {
    if (input && input !== '') {
        const dateInput = new Date(input);
        const formattedInputDate = dateInput.toLocaleDateString
          ('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
        return formattedInputDate;
    } else {
        return 'n/a';
    }
  }

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {
            contractDetails && (
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
                            <TableCell align="left">{formattedDate(contractDetails.contract_created_at)}</TableCell>
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
                            <TableCell align="left">{formattedDate(contractDetails.item_pickup_date)}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ width: 150 }} align="left">
                            <Typography>Contract Deadline:</Typography></TableCell>
                            <TableCell align="left">{formattedDate(contractDetails.contract_deadline)}</TableCell>
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
                            <TableCell align="left">
                                {userAction ?   <div>
                                                    <TextField 
                                                        required
                                                        label='Your Signature'
                                                        size='small'
                                                        // value={newContractDetails.second_party_signature}
                                                        // onChange={handleChangeFor('second_party_signature')}
                                                    /> 
                                                    <Typography>By typing your name, you are agreeing that your typed signature has the same authority as a handwritten signature.</Typography>
                                                </div>
                                                :
                                contractDetails.second_party_signature}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ width: 150 }} align="left">
                            <Typography>Images:</Typography></TableCell>

                            {/* once image upload is enabled, the img src will be the uploaded image file */}
                            <TableCell align="left">
                            <img src="https://i.ebayimg.com/images/g/ZUkAAOSw0x1jd7sn/s-l500.jpg"
                                alt="guitar"
                                width="200" /></TableCell>
                        </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }
        
      </Container>
  );
}

export default ContractPreview;