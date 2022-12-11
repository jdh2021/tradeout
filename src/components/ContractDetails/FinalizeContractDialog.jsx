import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const FinalizeContractDialog = ({open, handleClickCloseFinalize}) => {
    return  <>
                <Dialog
                    open={open}
                    onClose={handleClickCloseFinalize}
                >
                    <DialogTitle>
                        {"You must enter your signature in order to finalize this contract."}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClickCloseFinalize} variant="contained" color="green">OK</Button>
                    </DialogActions>
                </Dialog>
            </>
}

export default FinalizeContractDialog;