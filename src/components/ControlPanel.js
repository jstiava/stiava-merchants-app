
import React, { useState, useEffect } from 'react';
import { Chip, Autocomplete, TextField, IconButton, Badge, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, Alert, AlertTitle, DialogActions, Button } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

// Date & Time
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

// Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import SortIcon from '@mui/icons-material/Sort';

const ControlPanel = (props) => {

    const { view, dateTime, categories, selectedCategories, position, locations, sort, methods } = props;
    const { handleMerchantsRankingByScore, handleMerchantsRankingByAlpha, handleMerchantsRankingByProximity } = sort;
    const { shiftPositionContext, setView, setSelectedCategories } = methods;

    useEffect(() => {
        console.log("Trying to load control panel");
        if (categories === undefined || locations === undefined || selectedCategories === undefined || view === undefined) {
            return;
        }
        setLoading(false);
    }, [categories, locations, selectedCategories, view, dateTime]);


    const formatDate = (dateString) => {
        const inputDate = dateString.toString();
        const year = inputDate.slice(0, 4);
        const month = (parseInt(inputDate.slice(4, 6)) + 1).toString().padStart(2, '0');
        const day = inputDate.slice(6, 8);

        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    };

    const [dateValue, setDateValue] = React.useState('');

    const [loading, setLoading] = useState(true);
    const [lastSort, setLastSort] = useState("");

    const [panel, setPanel] = useState({
        sort: false,
        clock: false,
        location: false,
        filter: false,
        a11y: false,
    });

    const handlePanelToggle = (key) => {
        console.log(panel[key]);
        setPanel((prevState) => ({
            ...prevState,
            [key]: !prevState[key], // Toggle the value
        }));
    };

    const menuprops = {
        PaperProps: {
            style: {
                maxheight: 48 * 5.5 + 8,
                width: 300,
            },
        },
    };

    const handleSort = (string) => {
        console.log(string);
        switch (string) {
            case "recommended":
                console.log("RANK: score");
                handleMerchantsRankingByScore(selectedCategories, position.coords);
                break;
            case "alpha":
                console.log("RANK: alpha");
                handleMerchantsRankingByAlpha(selectedCategories);
                break;
            case "closest":
                console.log("RANK: closest");
                handleMerchantsRankingByProximity(selectedCategories, position.coords);
                break;
        }
        setLastSort(string);
    }


    const handleLocationChange = (event, newValue) => {
        if (newValue.id == 1 || newValue.id == 2) {
            setLastSort("alpha");
        }
        else {
            setLastSort("recommended");
        }
        shiftPositionContext(newValue.id);
        handlePanelToggle('location');
    };

    const handleContrastChange = (id, string) => {
        setView((prev) => ({
            ...prev,
            contrast: id
        }))
    }

    const handleCategorySelect = (id) => {
        setSelectedCategories((prev) => {
            const updatedCategories = new Set(prev);
            updatedCategories.add(id);
            return updatedCategories;
        });
    };

    const handleCategoryDeselect = (id) => {
        setSelectedCategories((prev) => {
            const updatedCategories = new Set(prev);
            updatedCategories.delete(id);
            return updatedCategories;
        });
    };

    const matchesSmallScreen = useMediaQuery('(max-width: 600px)');
    const matchesMediumScreen = useMediaQuery('(min-width: 601px) and (max-width: 960px)');
    const column_size = matchesSmallScreen ? '100%' : "18%";


    if (loading) {
        return null;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='root_control-header'>
                <div className='root_control-top'>
                    <Tooltip title="Accessibility">
                        <Badge badgeContent=" " color='primary' variant="dot" overlap="circular" invisible={true}>
                            <IconButton aria-label="location_settings" onClick={() => { handlePanelToggle('a11y') }}>
                                <AccessibilityNewIcon />
                            </IconButton>
                        </Badge>
                    </Tooltip>
                    <Tooltip title="Date & Time">
                        <Badge badgeContent=" " color='primary' variant="dot" overlap="circular">
                            <IconButton aria-label="schedule" onClick={() => { handlePanelToggle('clock') }}>
                                <ScheduleIcon />
                            </IconButton>
                        </Badge>
                    </Tooltip>
                    <Tooltip title="Location Services">
                        <Badge badgeContent=" " color='primary' variant="dot" overlap="circular" invisible={true}>
                            <IconButton aria-label="location_settings" onClick={() => { handlePanelToggle('location') }}>
                                <LocationOnIcon />
                            </IconButton>
                        </Badge>
                    </Tooltip>
                </div>
                <div className='root_control-quickclear'>
                    <div className='chip_container'>
                        <SortIcon />
                        <Chip
                            key="alpha"
                            value="alpha"
                            label="Sort A to Z"
                            color="primary"
                            variant={lastSort == "alpha" ? "filled" : "outlined"}
                            onClick={() => handleSort("alpha")}
                        />
                        {position.context === 1 || position.context === 2 ? (<></>) : (
                            <Chip
                                key="closest"
                                value="closest"
                                label="Closest"
                                color="primary"
                                variant={lastSort == "closest" ? "filled" : "outlined"}
                                onClick={() => handleSort("closest")}
                            />
                        )}
                        <Chip
                            key="recommended"
                            value="recommended"
                            label="Recommended"
                            color="primary"
                            variant={lastSort == "recommended" ? "filled" : "outlined"}
                            onClick={() => handleSort("recommended")}
                        />
                    </div>
                </div>

                {position.context === 1 ? (
                    <Alert
                        // variant="filled" 
                        severity="error">
                        <AlertTitle>You are out of region</AlertTitle>
                        Welcome to WashU! We've done a couple things to personalize your experience.<br></br>Let's sort our merchants list A-Z. And we are deleting our record of your location.
                    </Alert>) : (<></>)}
                {position.context === 2 ? (
                    <Alert
                        // variant="filled" 
                        severity="error">
                        <AlertTitle>Location Services Denied</AlertTitle>
                        We never save nor sell your personal data or current location. <br></br>Granting location services allows us to build a personalized list for you, ranking each merchant based on proximity.
                    </Alert>) : (<></>)}
                <div className='root_control-quickclear'>
                    <div className='chip_container'>
                        {categories.map((category) => (
                            <Chip
                                key={category.id}
                                value={category.id}
                                label={category.name}
                                color="primary"
                                variant={selectedCategories.has(category.id) ? "filled" : "outlined"}
                                onClick={selectedCategories.has(category.id) ? () => handleCategoryDeselect(category.id) : () => handleCategorySelect(category.id)}
                                onDelete={selectedCategories.has(category.id) ? () => handleCategoryDeselect(category.id) : undefined}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Dialog className='dialog_box' open={panel.clock} onClose={() => { handlePanelToggle('clock') }}>
                <DialogTitle>Date & Time</DialogTitle>
                <DialogContent>
                    <DatePicker className='date_picker' label="Date" defaultValue={dayjs(formatDate(dateTime.serialDate))} onChange={(newValue) => { console.log(newValue) }} />
                    <TimePicker label="Time" />
                </DialogContent>
            </Dialog>


            <Dialog className='dialog_box' open={panel.location} onClose={() => { handlePanelToggle('location') }}>
                <DialogTitle>Location</DialogTitle>
                <DialogContent>
                    <p>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</p>
                    <Autocomplete
                        disablePortal
                        id="demo-simple-select"
                        value={locations[position.context]}
                        onChange={handleLocationChange}
                        options={locations}
                        sx={{ width: '100%' }}
                        menuprops={menuprops}
                        renderInput={(params) => <TextField {...params} label="Select Location" />}
                    />
                    <Alert severity="info">
                        <AlertTitle>How we use your location data</AlertTitle>
                        <p>We ask to collect your location for the purpose of sorting our merchants list according to what is close by to you.</p>
                        <p>If you are in-region, we may "cache" your coordinates for about 30 minutes to avoiding needing to prompt you with duplicate requests.</p>
                        <p>Cached locations are deleted after 30 minutes. At any point, if you select "Do Not Use My Location" or "Forget My Location" we immidiately delete all trace of your coordinates.</p>
                        <p>Your location is NEVER saved to a computer or server that is not your own computer. We will never sell your data.</p>
                        <p>Out of region coordinates are never saved nor cached.</p>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus>
                        Forget My Location
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog className='dialog_box' open={panel.a11y} onClose={() => { handlePanelToggle('a11y') }}>
                <DialogTitle>Accessibility</DialogTitle>
                <DialogContent>
                    <div className='chip_container'>
                        <Chip
                            key="improved_contrast"
                            value="improved_contrast"
                            label="Improved Contrast Mode"
                            color="primary"
                            variant={view.contrast == 1 ? "filled" : "outlined"}
                            onClick={() => { handleContrastChange(1, "improved_contrast") }}
                        />
                        <Chip
                            key="high_contrast"
                            value="high_contrast"
                            label="High Contrast Mode"
                            color="primary"
                            variant={view.contrast == 2 ? "filled" : "outlined"}
                            onClick={() => { handleContrastChange(2, "high_contrast") }}
                        />
                        <Chip
                            key="off"
                            value="off"
                            label="None"
                            color="primary"
                            variant={view.contrast == 0 ? "filled" : "outlined"}
                            onClick={() => { handleContrastChange(0, "off") }}
                        />
                    </div>
                </DialogContent>
            </Dialog>



        </LocalizationProvider>
    )
};

export default ControlPanel;