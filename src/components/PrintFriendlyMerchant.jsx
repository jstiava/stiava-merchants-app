import { clean_text } from '../helpers/esthetics';

const PrintFriendlyMerchant = (props) => {

    return (
        <div className='merchant print_friendly'>
            <p>{clean_text(props.title)}</p>
        </div>
    );
};

export default PrintFriendlyMerchant;