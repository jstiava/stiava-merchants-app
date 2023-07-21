// Import statements
import React, { useEffect, useState } from 'react';
import { useMediaQuery, Button } from '@mui/material';
import { Masonry } from '@mui/lab';
import { useTheme } from '@mui/material/styles';

import useLocation from './hooks/useLocation';
import useMerchantsDriver from './hooks/useMerchantsDriver';
import useCategories from './hooks/useCategories';
import Merchant from './components/Merchant';
import ControlPanel from './components/ControlPanel';
import { DataGrid } from '@mui/x-data-grid';
import MerchantSkeleton from './components/Merchant/MerchantSkeleton';

import { Box } from '@mui/material';

// Hours
import { hoursAbstrator } from './helpers/Hours';

import { ReactComponent as AnimatedWashUIconGrey } from './icons/animated_washu_icon_grey.svg';
import { clean_text } from './helpers/esthetics';

// Initiate App component
const MerchantsApp = () => {

    const theme = useTheme();

    const { dateTime, merchants, fetchFlag, handleMerchantsRankingByScore, handleMerchantsRankingByAlpha, handleMerchantsRankingByProximity } = useMerchantsDriver();

    const { position, locations, shiftPositionContext } = useLocation(dateTime, handleMerchantsRankingByProximity);

    const { categories, implicitCategories, selectedCategories, setSelectedCategories } = useCategories(dateTime);


    // Component State Management
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState({
        contrast: 0,
        dark: false,
        reader: false
    });


    useEffect(() => {
        console.log("Try to render...")
        if (position.context === null || selectedCategories === null) {
            return;
        }

        if (position.context === 1 || position.context === 2) {
            handleMerchantsRankingByAlpha(selectedCategories);
        }
        else if (position.context === 0) {
            handleMerchantsRankingByProximity(selectedCategories, position.coords)
        }
        else {
            handleMerchantsRankingByScore(selectedCategories, position.coords);
        }

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [selectedCategories, position, fetchFlag]);


    const tableColumns = [
        {
            field: 'merchantTitle',
            headerName: 'Merchant Name',
            width: 350,
            editable: false,
            valueGetter: (params) =>
                `${clean_text(params.row.title) || ''}`,
        },
        {
            field: 'hours',
            headerName: 'Hours',
            width: 350,
            editable: false,
            noWrap: false,
            valueGetter: (params) => {
                if (params.row.hours === undefined || dateTime.day === undefined) {
                    return null;
                }

                if (params.row.hours === false) {
                    return "- -";
                }
                return "Hours not set";
                // return hoursAbstrator(params.row.hours, dateTime.day).join("; ");
            }
        }
    ];


    const matchesSmallScreen = useMediaQuery('(max-width: 600px)');
    const matchesMediumScreen = useMediaQuery('(min-width: 601px) and (max-width: 1260px)');
    const columns = matchesSmallScreen ? 1 : matchesMediumScreen ? 2 : 3;
    const spacing = matchesSmallScreen ? 2 : matchesMediumScreen ? 3 : 4;

    // Render the component based on the value of isPrintFriendlyMode
    return (
        <div className={`root_container ${view.reader ? "print_friendly" : ''} ${theme.palette.mode}`}>

            <ControlPanel
                view={view}
                dateTime={dateTime}
                categories={categories}
                selectedCategories={selectedCategories}
                position={position}
                locations={locations}
                sort={{ handleMerchantsRankingByScore, handleMerchantsRankingByAlpha, handleMerchantsRankingByProximity }}
                methods={{ shiftPositionContext, setView, setSelectedCategories }}
            />

            {loading ? (
                <>
                    <Masonry columns={columns} spacing={`2em`}>
                        {
                            Array.from({ length: 12 }).map((_, index) => (
                                <MerchantSkeleton key={index} />
                            ))
                        }
                    </Masonry>
                </>
            ) : (<></>)}

            {view.reader ? (
                <Box sx={{ height: "fit-content", width: '100%' }}>
                    <DataGrid
                        rows={merchants}
                        columns={tableColumns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 50,
                                },
                            },
                        }}
                        pageSizeOptions={[50]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
            ) : (
                <>
                    <Masonry columns={columns} spacing={3}>
                        {merchants.map((merchant) => (
                            <Merchant key={merchant.id} dateTime={dateTime} view={view} setView={setView} {...merchant}
                            />
                        ))}
                    </Masonry>
                </>
            )}
            {selectedCategories.size > 0 ? (
                <Button variant="contained" onClick={() => { setSelectedCategories(new Set()) }}>Clear Filters</Button>

            ) : (<></>)}
            <div className="footer_container">
                <AnimatedWashUIconGrey className='footer-icon' />
                <div className='footer_container__content'>
                    <p>Made by Jeremy Stiava, EN 2024</p>
                    <p>Dining Services & Business Operations</p>
                    <p>Washington University in St. Louis</p>
                </div>

            </div>
        </div>
    );
};

export default MerchantsApp;