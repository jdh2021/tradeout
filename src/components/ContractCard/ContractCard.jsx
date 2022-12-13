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

        <Card className="card" onClick={() => selectedContract(contract)} sx={{
       maxWidth: 345,
       color: "#2b2b2b",
       borderRadius: "15px",
       boxShadow: "0 1px 20px rgb(0, 0, 0, 0.1)",
       margin: "15px"
       }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={contract.item_image}
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