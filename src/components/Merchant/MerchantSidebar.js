import React, { useState, useEffect, createRef, useRef } from 'react';
import ReactDOM from 'react-dom';
import { clean_text } from '../../helpers/esthetics';

import Hours from "./Hours";

import { calculateContrastRatio, reduceLuminosity } from '../../helpers/contrast-check';

import { Alert, Box, CardActions, Button, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, IconButton, Tooltip, Badge, AlertTitle, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

// Flicking
import Flicking from "@egjs/react-flicking";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DirectionsIcon from '@mui/icons-material/Directions';
import LanguageIcon from '@mui/icons-material/Language';
import AddIcon from '@mui/icons-material/Add';

// Calendar
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Wordmark, MerchantHead, Seal, MerchantFoot } from './../Merchant/MerchantComponents';

import Venue from './Venue';



/**
 * 
 * @param {*} merchant 
 * @param {*} dateTime 
 * @param {*} ...props
 * @returns 
 */
const MerchantSidebar = ({ merchant, dateTime, ...props }) => {

    console.log(props);

    // Accordion
    const [expanded, setExpanded] = React.useState(false);

    const handleAccordion = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Tab Panel
    const merchant_drawer = useRef(null);
    const handleChange = (event, newValue) => {
        merchant_drawer.current.scrollTo(0, 0);
        setValue(newValue);
    };
    const [value, setValue] = useState('1');
    const [colorContrast, setColorContrast] = useState(10);

    // Contrast Color
    useEffect(() => {
        if (props.color_scheme.secondary === undefined) {
            return;
        }
        // setColorContrast(calculateContrastRatio(props.color_scheme.primary, props.color_scheme.secondary));
    }, [props.color_scheme.primary, props.color_scheme.secondary]);


    const improveContrast = () => {
        console.log(props);
        props.setView((prev) => ({
            ...prev,
            contrast: 1
        }))
    }

    const moveToPrevPanel = async () => {
        try {
            await flicking.current.prev();
        } catch (e) {
            console.log(e);
        }
    }

    const moveToNextPanel = async () => {
        try {
            await flicking.current.next();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Box
            sx={{ width: 'auto' }}
            role="presentation"
            className={`merchant_drawer ${props.color_scheme.secondary === "#ffffff" ? "icon_white" : "icon_dark"}`}
            style={{ backgroundColor: props.color_scheme.primary, color: props.color_scheme.secondary }}
            ref={merchant_drawer}
        >
            <Seal icon_type={props.icon_type} icon={props.icon}>
                <Wordmark title={props.title} icon={props.icon} icon_type={props.icon_type} />
                <p className='description'>{clean_text(props.description)}</p>
            </Seal>
            <List className='main_sidebar_content'>
                {props.description ? (
                    <div className='merchant_drawer__content'>
                        <p>{props.description}</p>
                    </div>
                ) : (<></>)}

                {Object.entries(props.venues).length > 0 ? (<></>) : (
                    <div className='merchant_drawer__content'>

                        {props.status.sequence.length !== 0 ? (
                            <Timeline
                                sx={{
                                    [`& .${timelineItemClasses.root}:before`]: {
                                        flex: 0,
                                        padding: 0,
                                    },
                                }}
                            >
                                <TimelineItem>
                                    <TimelineSeparator>
                                        <TimelineDot variant={!props.status.isOpen ? "outlined" : ""} />
                                        {props.status.sequence.length === 0 ? (<></>) : (<TimelineConnector />)}
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <strong>{props.status.isOpen ? "OPEN NOW" : "CLOSED"}</strong>
                                        <br></br>
                                        <Hours status={props.status} />
                                    </TimelineContent>
                                </TimelineItem>
                                {props.status.sequence.length === 0 ? (<></>) : (
                                    <TimelineItem>
                                        <TimelineSeparator>
                                            <TimelineDot variant={!props.status.isOpen ? "" : "outlined"} />
                                            {props.status.sequence.length < 3 ? (<></>) : (<TimelineConnector />)}
                                        </TimelineSeparator>
                                        <TimelineContent>{props.status.sequence[0]} - {props.status.sequence[1]}</TimelineContent>
                                    </TimelineItem>
                                )}
                                {props.status.sequence.length < 3 ? (<></>) : (
                                    <TimelineItem>
                                        <TimelineSeparator>
                                            <TimelineDot variant={!props.status.isOpen ? "outlined" : ""} />
                                        </TimelineSeparator>
                                        <TimelineContent>{props.status.sequence[2]} - {props.status.sequence[3]}</TimelineContent>
                                    </TimelineItem>
                                )}
                            </Timeline>

                        ) : (
                            <Hours status={props.status} />
                        )}

                        {props.status.object.type === 'special' ? (
                            <Alert
                                severity="warning">
                                <AlertTitle>Special Hours</AlertTitle>
                                See instructions for more information.
                                <CardActions>
                                </CardActions>
                            </Alert>
                        ) : (<></>)}


                    </div>
                )}

                {Object.entries(props.venues).length === 0 ? ('') : (
                    <div className='merchant_drawer__content venues'>
                        {props.venues.map((venue) => (
                            <Venue key={venue.ID}
                            primary={props.color_scheme.primary}
                            secondary={props.color_scheme.secondary} onChange={handleAccordion} expanded={expanded === venue.ID} {...venue} />
                        ))}
                    </div>
                )}

            </List>
            <List>
                <ListItem key="go" disablePadding>
                    <ListItemButton onClick={() => { window.location = props.site_link }}>
                        <ListItemIcon><LanguageIcon /></ListItemIcon>
                        <ListItemText primary="Go to Merchant Site" />
                    </ListItemButton>
                </ListItem>
                <ListItem key="navigate" disablePadding>
                    <ListItemButton onClick={() => { window.location = props.navigate }}>
                        <ListItemIcon><DirectionsIcon /></ListItemIcon>
                        <ListItemText primary="Directions" />
                    </ListItemButton>
                </ListItem>
                <ListItem key="feedback" disablePadding>
                    <ListItemButton onClick={() => { window.location = props.link }}>
                        <ListItemIcon><RateReviewIcon /></ListItemIcon>
                        <ListItemText primary="Feedback" />
                    </ListItemButton>
                </ListItem>

            </List>
            <Divider />
            <List style={{ position: "fixed", bottom: 0, backgroundColor: props.color_scheme.primary, color: props.color_scheme.secondary, width: "100%" }}>
                <ListItem key="close" disablePadding>
                    <ListItemButton onClick={merchant.toggleDrawer(false)}>
                        <ListItemIcon><CloseIcon /></ListItemIcon>
                        <ListItemText primary="Close" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box >
    )
}

export default MerchantSidebar;