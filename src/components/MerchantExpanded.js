import { useEffect, useState } from 'react';
import { clean_text } from '../helpers/esthetics';
import { Box, Modal } from '@mui/material';
import { isOpen } from '../helpers/Hours';

import { Wordmark, MerchantHead, Seal, MerchantFoot } from './MerchantComponents';

function MerchantExpanded(props) {

    const [open, setOpen] = useState(true);
    const [status, setStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Hours not set");

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    const styles = {
        backgroundColor: props.esthetics.primary_color,
        color: props.esthetics.secondary_color
    };

    useEffect(() => {
        console.log("Update!");
        setOpen(true);
    }, [props.active]);


    useEffect(() => {
        if (props.day === undefined || props.serialDate === undefined || props.hourMin === undefined) {
            return;
        }
        try {
            const value = isOpen(props.schedule.regular, props.serialDate, props.day, props.hourMin);
            setStatus(value);
            if (value) {
                setStatusMessage("Open Now");
            }
            else {
                setStatusMessage("Closed");
            }
        }
        catch (err) {
            setStatus(false);
            console.log(err);
        }
    }, [props.day, props.serialDate, props.hourMin]);

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='merchant_expanded' style={styles}>
                    <div className='merchant__content'>
                        <Seal icon_type={props.esthetics.icon_type} icon={props.esthetics.icon}>
                            <Wordmark title={props.title} icon={props.esthetics.icon} icon_type={props.esthetics.icon_type} />
                            <p className='description'>{clean_text(props.description)}</p>
                        </Seal>
                    </div>
                    <div className='flex'>
                        <a className='link' href={props.link}>View</a>
                        <div className='chip' style={{ backgroundColor: props.esthetics.secondary_color, color: props.esthetics.primary_color }}>{statusMessage}</div>
                        <p></p>
                    </div>

                </Box>
            </Modal>
        </div>
    );
}

export default MerchantExpanded;