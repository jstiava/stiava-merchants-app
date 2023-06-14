// Import statements
import React, { useEffect, useState, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Masonry} from '@mui/lab';

import useDateTime from './hooks/useDateTime';
import useLocation from './hooks/useLocation';
import useMerchants from './hooks/useMerchants';
import useCategories from './hooks/useCategories';
import Merchant from './components/Merchant';
import MerchantExpanded from './components/MerchantExpanded';
import ControlPanel from './components/ControlPanel';
import PrintFriendlyMerchant from './components/PrintFriendlyMerchant.jsx';

import { ReactComponent as AnimatedWashUIcon } from './icons/animated_washu_icon.svg';

import { ControlPanelContext } from './ControlPanelProvider';

// Initiate App component
const App = () => {

    const { isPrintFriendlyMode } = useContext(ControlPanelContext);

    const { date, serialDate, day, hourMin, recent } = useDateTime();

    const { categories, implicitCategories, selectedCategories, setSelectedCategories } = useCategories(day, hourMin);

    const { position, locations, locationContext, setLocationContext } = useLocation(date, recent);
    
    const { merchants, orderByScore, orderByProximity, orderByAlpha,
    } = useMerchants(serialDate, day, hourMin, position, implicitCategories, selectedCategories);

    
    // Component State Management
    const [loading, setLoading] = useState(true);
    const [isMerchantExpanded, setIsMerchantExpanded] = useState(false);
    const [expandedMerchant, setExpandedMerchant] = useState('');


    /**
     * 
     */
    useEffect(() => {
        if (merchants.length != 0) {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }

    }, [merchants]);

    // Optional Rendering
    useEffect(() => {
        if (isPrintFriendlyMode) {
            console.log("Reorder to print");
            orderByAlpha();
        }
    }, [isPrintFriendlyMode]);


    function handleMerchantClick(props) {
        setIsMerchantExpanded(true);
        setExpandedMerchant(props);
    }

    function handleClose() {
        setIsMerchantExpanded(false);
    }

    const matchesSmallScreen = useMediaQuery('(max-width: 600px)');
    const matchesMediumScreen = useMediaQuery('(min-width: 601px) and (max-width: 960px)');
    const columns = matchesSmallScreen ? 1 : matchesMediumScreen ? 2 : 3;
    const spacing = matchesSmallScreen ? 2 : matchesMediumScreen ? 3 : 4;

    if (loading) {
        return (
            <div className="loading_container">
                <AnimatedWashUIcon className='loading-icon' />
            </div>
        )
    };

    // Render the component based on the value of isPrintFriendlyMode
    return (
        <div className={`root_container ${isPrintFriendlyMode ? 'print_friendly' : ''}`}>
            
            <ControlPanel
                categories={categories}
                selectedCategories={selectedCategories}
                locations={locations}
                locationContext={locationContext}
                methods={{orderByScore,orderByProximity, orderByAlpha,setSelectedCategories, setLocationContext }}
            />

            {isPrintFriendlyMode ? (
                merchants.map((merchant) => (
                    <PrintFriendlyMerchant key={merchant.id} {...merchant} />
                ))
            ) : (
                <>
                    <Masonry columns={columns} spacing={spacing}>
                        {merchants.map((merchant) => (
                            <Merchant onClick={() => { handleMerchantClick(merchant) }} key={merchant.id} day={day} serialDate={serialDate} hourMin={hourMin} {...merchant} />
                        ))}
                    </Masonry>
                </>
            )}

            {isMerchantExpanded ? (
                <>
                    <MerchantExpanded onClose={() => { handleClose() }} active={isMerchantExpanded} day={day} serialDate={serialDate} hourMin={hourMin} {...expandedMerchant}></MerchantExpanded>
                </>
            ) : ('')}
        </div>
    );
};

export default App;