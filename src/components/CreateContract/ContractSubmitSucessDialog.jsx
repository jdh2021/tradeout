import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const ContractSubmitSuccessDialog = ({open, handleClickCloseSubmitSuccess}) => {
    return  <>
                <Dialog
                    open={open}
                    onClose={handleClickCloseSubmitSuccess}
                >
                    <DialogTitle>
                        {'Your contact has been created, and the recipient has been sent an email inviting them to view the contract details.'}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClickCloseSubmitSuccess} variant="contained" color="green">OK</Button>
                    </DialogActions>
                </Dialog>
            </>
}

export default ContractSubmitSuccessDialog;