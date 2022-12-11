import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const RecipientViewAcceptDialog = ({open, handleClickCloseAccepted}) => {
    return  <>
                <Dialog
                    open={open}
                    onClose={handleClickCloseAccepted}
                >
                    <DialogTitle>
                        {"You'll now be routed to registration where you can register as a TradeOut user and accept this contract."}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClickCloseAccepted} variant="contained" color="green">OK</Button>
                    </DialogActions>
                </Dialog>
            </>
}

export default RecipientViewAcceptDialog;