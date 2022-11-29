import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const ContractRecipientAccess = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  // local state for changeable values of contract key being searched
  const [searchContractKey, setSearchContractKey] = useState('');

  return (
    <div>
      <Typography variant="h3" sx={{ textAlign: "center" }}>Access Contract</Typography>
      <br />
      <br />
      <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
        <Grid item>
          <form>
            <TextField
              required
              fullWidth
              label="Contract Key"
              size="small"
              helperText="Enter the contract key provided in the TradeOut email."
              value={searchContractKey}
              onChange={(event) => setSearchContractKey(event.target.value)}
            />
            <Box textAlign="center" sx={{ mt: 4 }}>
              <Button type="submit" variant="contained">View Contract</Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}

export default ContractRecipientAccess;
