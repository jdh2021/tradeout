import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const FinalizeSuccessDialog = ({open, handleClickCloseSuccess}) => {
    return  <>
                <Dialog
                    open={open}
                    onClose={handleClickCloseSuccess}
                >
                    <DialogTitle>
                        {"Congratulations! This contract is now finalized. You can download a PDF of the final document by selecting this contract on your Dashboard."}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClickCloseSuccess} variant="contained" color="green">OK</Button>
                    </DialogActions>
                </Dialog>
            </>
}

export default FinalizeSuccessDialog;