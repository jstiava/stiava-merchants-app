import LazyLoad from 'react-lazy-load';
import { clean_text } from '../helpers/esthetics';


export const MerchantHead = ({ primary_color, secondary_color, isOpen, statusMessage, image }) => {


    if (isOpen === false) {
        return null;
    }

    if (image === false) {
        return null;
    }
    else {
        return (
            <LazyLoad>
                <div className='merchant__head image' style={{ backgroundImage: 'url(' + image + ')' }}>
                </div>
            </LazyLoad>
        )
    }
};

export const Wordmark = ({ title, icon, icon_type }) => {
    if (icon_type === 'wordmark') {
        return (
            <div className='merchant__wordmark' style={{ backgroundImage: 'url(' + icon + ')' }} aria-label={clean_text(title)}></div>
        )
    }
    else {
        return (
            <h3 className='title'>{clean_text(title)}</h3>
        )
    }
};

export const Seal = (props) => {
    if (props.icon_type === 'circular') {
        return (
            <div className='seal'>
                <div className='seal_icon' style={{ backgroundImage: 'url(' + props.icon + ')' }}></div>
                <div className='seal_info'>
                    {props.children}
                </div>
            </div>
        );
    }

    return (
        <div className='normal'>{props.children}</div>
    );

};


export const MerchantFoot = ({ primary_color, secondary_color, isOpen, statusMessage }) => {

    return (
        <div className='merchant__foot'>
            <div className='toolbar'>
                <div className='flex'>
                    <div className='chip' style={{ backgroundColor: secondary_color + '25' }}>{statusMessage}</div>
                </div>
                <div className='flex'></div>
            </div>
        </div>
    )
};