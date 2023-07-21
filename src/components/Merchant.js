import React, { useState, useEffect, createRef, useRef } from 'react';
import ReactDOM from 'react-dom';
import { clean_text } from '../helpers/esthetics';
import MerchantSidebar from './Merchant/MerchantSidebar';
import { useTheme } from '@mui/material';

import { next } from '../helpers/Hours';
import { Wordmark, MerchantHead, Seal, MerchantFoot } from './Merchant/MerchantComponents';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// For drawer
import { Drawer, IconButton, Tooltip, Popover } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';

/**
 * 
 * @param {*} props 
 * @returns 
 */
const Merchant = (props) => {

    // Drawer
    const [drawer, setDrawer] = React.useState(false);
    const [drawerHasLoaded, setDrawerHasLoaded] = useState(false);


    const toggleDrawer = (open) => (event) => {
        setDrawerHasLoaded(true);
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawer(open);
    };


    const handleFavoriteButton = (event) => {
        event.stopPropagation();
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const hoursPopOpen = Boolean(anchorEl);

    const handleHoursPopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleHoursPopoverClose = () => {
        setAnchorEl(null);
    };


    return (
        <>
            <button onClick={toggleDrawer(true)} tabIndex="0" className="merchant" aria-label={props.title + ": Click to expand"}>
                <div className='merchant_container' style={{ backgroundColor: props.color_scheme.primary, color: props.color_scheme.secondary }}>
                    <div className='merchant__content'>
                        <Seal icon_type={props.icon_type} icon={props.icon}>
                            <Wordmark title={props.title} icon={props.icon} icon_type={props.icon_type} />
                            {props.description === "" ? ('') : (
                                <p className='description'>{clean_text(props.description)}</p>
                            )}
                        </Seal>
                        <div className='merchant__foot'>
                            <div className='toolbar'>
                                <div className='merchant__foot_content'>
                                    <div
                                        className={`chip status ${props.status.isOpen ? 'open' : 'closed'} ${props.status.object.type === 'special' ? 'special' : ''}`} style={props.status.isOpen ? { backgroundColor: props.color_scheme.secondary, color: props.color_scheme.primary, borderColor: props.color_scheme.secondary } : { backgroundColor: props.color_scheme.primary, color: props.color_scheme.secondary, borderColor: props.color_scheme.secondary }}
                                        aria-haspopup="true"
                                        aria-owns={hoursPopOpen ? 'mouse-over-popover' : undefined}
                                        onMouseEnter={handleHoursPopoverOpen}
                                        onMouseLeave={handleHoursPopoverClose}
                                    >
                                        {props.status.message}
                                    </div>
                                    <Popover
                                        id="mouse-over-popover"
                                        sx={{
                                            pointerEvents: 'none',
                                        }}
                                        open={hoursPopOpen}
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        onClose={handleHoursPopoverClose}
                                        disableRestoreFocus
                                    >
                                        <div className='hours_peek'>
                                            {props.status.object.type === "special" ? (
                                                <>
                                                    <p><strong>Special {props.status.object.name + " "}Hours</strong></p>
                                                    <p>{props.status.object.string}</p>
                                                </>

                                            ) : (
                                                <p>{props.status.object.string}</p>
                                            )}
                                        </div>
                                    </Popover>
                                    <Tooltip title="Favorite">
                                        <IconButton aria-label="favorite" onClick={handleFavoriteButton}>
                                            <FavoriteBorderIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <div className='flex'></div>
                            </div>
                        </div>

                    </div>
                </div>
            </button >

            <Drawer
                anchor={'right'}
                open={drawer}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        height: '100%',
                        width: '100%',
                        maxWidth: '500px'
                    },
                }}
            >
                {drawerHasLoaded &&
                    <MerchantSidebar
                        key={props.id}
                        dateTime={props.dateTime}
                        merchant={{ toggleDrawer }}
                        {...props}
                    />
                }
            </Drawer>

        </>



    );
};

export default Merchant;