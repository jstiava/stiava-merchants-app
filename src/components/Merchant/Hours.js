import React, { useState, useEffect } from 'react';
import { hoursAbstrator } from '../../helpers/Hours';
import { Box, Button, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, IconButton, Tooltip, Badge, Alert, AlertTitle, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


/**
 * 
 * @param {*} props 
 * @returns 
 */
const Hours = (props) => {

    // console.log(clean_text(props.title) + ": " + calculateContrastRatio(props.esthetics.primary_color, props.esthetics.secondary_color));
    return (
        <div className='hours_block'>
            <p>{props.status.object.string}</p>
        </div>
    );
};

export default Hours;