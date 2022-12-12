import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const PartyTypeDialog = ({open, handleClickClose}) => {
    return  <>
                <Dialog
                    open={open}
                    onClose={handleClickClose}
                >
                    <DialogTitle>
                        {"Please select whether you are the buyer or seller."}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClickClose} variant="contained" color="green">OK</Button>
                    </DialogActions>
                </Dialog>
            </>
}

export default PartyTypeDialog;