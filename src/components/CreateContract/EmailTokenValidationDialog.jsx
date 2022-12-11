import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const EmailTokenValidationDialog = ({open, handleClickCloseEmailToken}) => {
    return  <>
                <Dialog
                    open={open}
                    onClose={handleClickCloseEmailToken}
                >
                    <DialogTitle>
                        {'Please make sure you have entered the recipient email AND have clicked the "Generate Contract Token" button.'}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClickCloseEmailToken} variant="contained" color="green">OK</Button>
                    </DialogActions>
                </Dialog>
            </>
}

export default EmailTokenValidationDialog;