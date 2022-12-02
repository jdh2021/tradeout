import React, { useState,} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {useSelector, useDispatch} from 'react-redux';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';


function ContractCard({contract}) {

  const history = useHistory();
  
  


  //contract clicked on dashboard will direct user to specific contract details
  //useEffect in ContractDetails dispatches 'FETCH_CONTRACT_DETAILS' and sets the contract via url param of contractId
  const selectedContract = (contractToDisplay) => {
    console.log('in selectedContract click function', contractToDisplay.id);
    history.push(`/contract-details/${contractToDisplay.id}`);
  }
  
  return (
    <div>

        <Card sx={{ maxWidth: 345, margin:3}} onClick={() => selectedContract(contract)}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="https://images.theconversation.com/files/349961/original/file-20200728-29-6nb8o5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {contract.contract_title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contract.item_description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
    </div>
  );
}
export default ContractCard;