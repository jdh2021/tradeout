import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const ContractStatusUpdateDialog = ({handleClickCloseStatusUpdate, open}) => {
    return  <>
            <Dialog
                open={open}
                onClose={handleClickCloseStatusUpdate}
            >
                <DialogTitle>
                    {"Thank you! The contract has been declined."}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClickCloseStatusUpdate} variant="contained" color="green">OK</Button>
                </DialogActions>
            </Dialog>
        </>
}

export default ContractStatusUpdateDialog;