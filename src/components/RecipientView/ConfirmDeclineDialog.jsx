import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmDeclineDialog = ({open, handleClickCloseConfirmDecline, declineContract}) => {
    return  <>
                <Dialog
                open={open}
                onClose={handleClickCloseConfirmDecline}
            >
                <DialogTitle>
                    {"Are you sure you want to decline this contract?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClickCloseConfirmDecline} variant="contained" color="purple" sx={{color: '#FFFFFF'}}>No</Button>
                    <Button onClick={declineContract} variant="contained" color="green">Yes</Button>
                </DialogActions>
            </Dialog>
            </>
}

export default ConfirmDeclineDialog;