import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const ContractTokenDialog = ({open, handleClickCloseTokenDetails}) => {
    return  <>
                <Dialog
                    open={open}
                    onClose={handleClickCloseTokenDetails}
                >
                    <DialogTitle>
                        {'Why do I need to create a contract token?'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The contract token is a unique key that is associated with this contract. The recipient will receive an email with a link to view the details of this contract. The contract token is used in that link to ensure that they access this document securely.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClickCloseTokenDetails} variant="contained" color="green">OK</Button>
                    </DialogActions>
                </Dialog>
            </>
}

export default ContractTokenDialog;