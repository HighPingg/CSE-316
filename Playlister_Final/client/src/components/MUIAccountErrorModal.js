import { useContext } from 'react'
import AuthContext from '../auth';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    // bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    p: 4,
};

export default function MUIAccountErrorModal() {
    const { auth } = useContext(AuthContext);
    let text = "";
    if (auth.errorMsg !== null) {
        text = auth.errorMsg;
    }
    function handleCloseModal(event) {
        auth.acknowledgedError();
    }
    return (
        <Modal
            open={auth.errorMsg !== null && auth.errorMsg !== undefined}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                    <Alert severity='error'
                        sx={{width: '80%', margin: 'auto', marginTop: '10px'}}
                        >{text}</Alert>
                    <div id="confirm-cancel-container">
                        <Button
                            id="dialog-ok-button"
                            className="modal-button"
                            variant='contained'
                            onClick={handleCloseModal}
                        >Ok</Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}