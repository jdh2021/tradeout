import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const ContractRecipientAccess = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  // local state for changeable values of contract key being searched
  const [searchContractKey, setSearchContractKey] = useState('');

  return (
    <div>
      <Typography variant="h3" sx={{ textAlign: "center" }}>Access Contract</Typography>
    </div>
  );
}

export default ContractRecipientAccess;
