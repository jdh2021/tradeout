import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const CreateContractDetailsDialog = ({handleClickClose, open}) => {
    return  <>
                <Dialog
                    open={open}
                    onClose={handleClickClose}
                >
                    <DialogTitle>
                        {"Please complete all required fields (those with a *)."}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClickClose} variant="contained" color="green">OK</Button>
                    </DialogActions>
                </Dialog>
            </>
}

export default CreateContractDetailsDialog;