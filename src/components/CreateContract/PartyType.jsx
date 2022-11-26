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
  const newContractDetails = useSelector(store => store.contract.newContractDetails);
  const [secondParty, setSecondParty] = useState('');

  const handleChangeFor = (key) => (event) => {
    console.log('in handleChangeFor', event.target.value);
    if (event.target.value === 'buyer') {
      setSecondParty('seller');
    } else if (event.target.value === 'seller') {
      setSecondParty('buyer');
    }
    dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [key]: event.target.value}});
  }

  const handleChangeForSecondParty = (contractDetail, partyType) => {
    console.log('in handleChangeForSecondParty', contractDetail, partyType);
    if (partyType === 'buyer') {
      dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [contractDetail]: 'buyer'}});
    } else if (partyType === 'seller') {
      dispatch({type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, [contractDetail]: 'seller'}});
    }
    history.push('/create-contract-details');
  }

  // for testing the value being set onChange
  // const [firstPartyType, setFirstPartyType] = useState('');
  // const handleChange = (partyType) => {
  //   console.log('in handleChange', partyType);
  //   setFirstPartyType(partyType);
  // }
  // const toForm = () => {
  //   console.log('firstPartyType', firstPartyType);
  // }

  return (
    <div>
        <h1>Are you a buyer or seller?</h1>
        <FormControl>
          <RadioGroup
            value={newContractDetails.firstPartyType}
            onChange={handleChangeFor('firstPartyType')}
            // value={firstPartyType}
            // onChange={(event) => handleChange(event.target.value)} 
          >
            <FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
            <FormControlLabel value="seller" control={<Radio />} label="Seller" />
          </RadioGroup>
        </FormControl>
        <br />
        <br />
        <Button variant="contained" onClick={() => handleChangeForSecondParty('secondPartyType', secondParty)}>Next</Button>
    </div>
  );

}

export default PartyType;