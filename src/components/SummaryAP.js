import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import config from '../data/config.json';
import configAp1 from '../data/config_ap1.json';
import configAp2 from '../data/config_ap2.json';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StyledTypography, StyledAccordionSummary, StyledAccordion, componentStyles } from "../common/StyledComponents.js";

const SummaryAP = (props) => {
    
    const [numAps , setNumAps] = useState(2);
    const [apConfig, setApConfig] = useState([configAp1, configAp2]);
    const [expanded, setExpanded] = useState(false);
    const padding = props.padding;
    const sPlot = useRef(null);  

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const DisplayAPConfig = (i, config) => {
        return (
            <StyledAccordion 
                sx={{ boxShadow:"none" }} 
                // defaultExpanded={open[i]} 
                expanded={expanded===`AP${i+1}`}
                onChange={handleChange(`AP${i+1}`)}
            >
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`AP${i+1}-content`}
                    id={`AP${i+1}}-header`}
                >
                    <StyledTypography variant="subtitle1" sx={{
                        "font-weight":(expanded===`AP${i+1}`)?'600':'400',
                        "color":(expanded===`AP${i+1}`)?'black':'grey.500',
                    }}
                    >
                        AP {i+1}
                    </StyledTypography>
                </StyledAccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: "#ebebeb",}}>
                    {Object.keys(config).map(key => {
                        return (
                            <Stack direction="row" spacing={2}>
                                <StyledTypography>{key}</StyledTypography>
                                <StyledTypography sx={{textAlign: 'right'}}>{config[key]}</StyledTypography>
                            </Stack>
                        );
                    })}
                    {/* <svg ref={sPlot} width={props.width} height={props.height/2} />   */}
                </AccordionDetails>
            </StyledAccordion>
        );
    }

    useEffect(() => {       

    }, []);

	return (
    <div style={{ ...componentStyles, width: props.width, height: props.height, borderRadius: 10}}>
        <StyledTypography variant="h6" component="div" sx={{padding: `${padding}px`}}>
            Summary of APs
        </StyledTypography>
        {apConfig.map((config, idx)=> {
            return DisplayAPConfig(idx, config);
        })}
    </div>
    )
};
export default SummaryAP;
