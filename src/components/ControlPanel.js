
import React, { useState, useEffect } from 'react';
import { FormControlLabel, FormGroup, FormControl, Chip, Button, Switch, InputLabel, Select, MenuItem, Stack } from "@mui/material"


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ControlPanel = ({ categories, selectedCategories, locations, locationContext, methods }) => {

    const { orderByScore, orderByAlpha, orderByProximity, setSelectedCategories, setLocationContext } = methods;

    const [loading, setLoading] = useState(true);

    const [lastSort, setLastSort] = useState("");


    useEffect(() => {
        if (categories === undefined || locations === undefined || selectedCategories === undefined) {
            return;
        }
        setLoading(false);
    }, [categories, locations, selectedCategories]);

    const handlePrintModeToggle = (event) => {
        console.log(event);
    }

    const handleLocationServicesToggle = (event) => {
        console.log(event);
    }

    const handleLocationChange = (event) => {

        if (event.target.value != 1 || event.target.value != 2) {
            setLastSort("sort_proximity");
        }
        setLocationContext(() => {
            return event.target.value;
        })
    };

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


    if (loading) {
        return null;
    }

    return (
        <div className='root_control-panel'>

            <FormGroup>
                <Button variant="outlined" onClick={handlePrintModeToggle}>Print Friendly-Mode</Button>
            </FormGroup>

            <FormGroup>
                <h6>Location</h6>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-simple-select-label">Change Location</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={locationContext}
                        label="Selected Location"
                        onChange={handleLocationChange}
                        MenuProps={MenuProps}
                    >
                        {locations.map((location) => (
                            <MenuItem key={location.id} value={location.id}>
                                {location.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </FormGroup>

            <FormGroup>
                <h6>Categories</h6>
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
            </FormGroup>

            <FormGroup>
                <h6>Sorting</h6>
                <div className='chip_container'>
                    <Chip
                        key="sort_alpha"
                        value="sort_alpha"
                        label="A-Z"
                        color="primary"
                        variant={lastSort == "sort_alpha" ? "filled" : "outlined"}
                        onClick={() => {setLastSort("sort_alpha"); orderByAlpha();}}
                    />
                    <Chip
                        key="sort_proximity"
                        value="sort_proximity"
                        label="Closest"
                        color="primary"
                        variant={lastSort == "sort_proximity" ? "filled" : "outlined"}
                        onClick={() => {setLastSort("sort_proximity"); orderByProximity();}}
                    />
                </div>
            </FormGroup>
        </div>
    )
};

export default ControlPanel;