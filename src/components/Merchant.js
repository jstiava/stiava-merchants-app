import { clean_text } from '../helpers/esthetics';
import { isOpen } from '../helpers/Hours';
import { useState, useEffect } from 'react';
import { Wordmark, MerchantHead, Seal, MerchantFoot } from './MerchantComponents';
import LazyLoad from 'react-lazy-load';

/**
 * 
 * @param {*} props 
 * @returns 
 */
const Merchant = (props) => {

    const [status, setStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Hours not set");


    const styles = {
        backgroundColor: props.esthetics.primary_color,
        color: props.esthetics.secondary_color
    };

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
        }
    }, [props.day, props.serialDate, props.hourMin]);


    return (
        <button onClick={props.onClick} tabIndex="0" className="merchant">
            <div className='merchant_container' style={styles}>
                <MerchantHead primary_color={props.esthetics.primary_color} secondary_color={props.esthetics.secondary_color} isOpen={status} statusMessage={statusMessage} image={props.esthetics.image} />
                <div className='merchant__content'>
                    <Seal icon_type={props.esthetics.icon_type} icon={props.esthetics.icon}>
                        <Wordmark title={props.title} icon={props.esthetics.icon} icon_type={props.esthetics.icon_type} />
                        <p className='description'>{clean_text(props.description)}</p>
                    </Seal>
                    <MerchantFoot primary_color={props.esthetics.primary_color} secondary_color={props.esthetics.secondary_color} isOpen={status} statusMessage={statusMessage} />
                </div>
            </div>
        </button>
    );
};

export default Merchant;