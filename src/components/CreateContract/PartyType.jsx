import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';


const PartyType = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  // const newContractDetails = useSelector(store => store.contract.newContractDetails);

  // const handleChangeFor = (key) => (event) => {
  //   console.log('in handleChangeFor');
  //   dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [key]: event.target.value}});
  //   if (event.target.value === 'buyer') {
  //     dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [secondPartyType]: 'seller'}});
  //   } else if (event.target.value === 'seller') {
  //     dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [secondPartyType]: 'buyer'}});
  //   }
  // }

  // for testing the value being set onChange
  const [firstPartyType, setFirstPartyType] = useState('');
  const handleChange = (partyType) => {
    console.log('in handleChange', partyType);
    setFirstPartyType(partyType);
  }
  const toForm = () => {
    console.log('firstPartyType', firstPartyType);
  }

  return (
    <div>
        <h1>Are you a buyer or seller?</h1>
        <FormControl>
          <RadioGroup
            // value={newContractDetails.firstPartyType}
            // onChange={handleChangeFor('firstPartyType')}
            value={firstPartyType}
            onChange={(event) => handleChange(event.target.value)} 
          >
            <FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
            <FormControlLabel value="seller" control={<Radio />} label="Seller" />
          </RadioGroup>
        </FormControl>
        <br />
        <br />
        <Button variant="contained" onClick={() => history.push('/create-contract-details')}>Next</Button>
    </div>
  );

}

export default PartyType;