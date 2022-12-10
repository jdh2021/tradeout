import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const RecipientViewAcceptDialog = ({acceptedOpen, handleClickCloseAccepted}) => {
    return  <>
                <Dialog
                    acceptedOpen={acceptedOpen}
                    onClose={handleClickCloseAccepted}
                >
                    <DialogTitle>
                        {"Remove this pet's profile?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClickCloseAccepted} variant="contained" color="green">OK</Button>
                    </DialogActions>
                </Dialog>
            </>
}

export default RecipientViewAcceptDialog;