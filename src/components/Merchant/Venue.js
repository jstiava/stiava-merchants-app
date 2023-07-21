import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


/**
 * 
 * @param {*} props 
 * @returns 
 */
const Venue = (props) => {

    const standardColors = ["#005f85", "#ffffff"];
    const specialColors = ["#ffcc00", "#000000"];
    const closureColors = ["#DA2E57", "#ffffff"];
   
    return (
        <Accordion expanded={props.expanded}
            onChange={props.onChange(props.ID)}
            className='venue'
            style={{backgroundColor: props.primary, color: props.secondary}}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography sx={{ width: '80%', flexShrink: 0 }}>
                    {props.title}
                </Typography>
                {/* <Typography sx={{ color: 'text.secondary' }}></Typography> */}

            </AccordionSummary>
            <AccordionDetails>
                {props.description === "" ? (<></>) : (
                    <p>{props.description}</p>
                )}
                {props.status.source === 'market' ? (<></>) : (
                    <p>{props.status.object.string}</p>
                )}
            </AccordionDetails>
        </Accordion>
    )
}

export default Venue;