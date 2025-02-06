import React from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';


// alert helper
export const Alert = ({ open, setOpen, message, severity }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity={severity} elevation={6} variant="filled">
                {message}
            </MuiAlert>
        </Snackbar>
    );
}