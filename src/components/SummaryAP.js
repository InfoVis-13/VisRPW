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
import { useSelectedAP, useGraphNumber } from "../common/DataContext.js";

const SummaryAP = (props) => {
    
    const [apConfig, setApConfig] = useState([configAp1, configAp2]);
    const {selectedAP, setSelectedAP} = useSelectedAP(); // -1: none, 0: AP1, 1: AP2
    const {graphNumber, setGraphNumber} = useGraphNumber();
    // const [selectedAP, setSelectedAP] = useState(-1);
    const padding = props.padding;

    const handleChange = (panel) => (event, isExpanded) => {
        console.log(panel);
        setSelectedAP(isExpanded ? panel : -1);
        if(graphNumber!==1){
            console.log("remove");
            d3.selectAll(".selection").remove();
            d3.selectAll(".handle").remove();   
            setGraphNumber(1);
        }
    };

    const DisplayAPConfig = (i, config) => {
        return (
            <StyledAccordion 
                sx={{ boxShadow:"none" }} 
                // defaultExpanded={open[i]} 
                expanded={selectedAP===i}
                onChange={handleChange(i)}
            >
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`AP${i+1}-content`}
                    id={`AP${i+1}}-header`}
                >
                    <StyledTypography variant="subtitle1" sx={{
                        "font-weight":(selectedAP===i)?'600':'400',
                        "color":(selectedAP===i || selectedAP===-1)?'black':'grey.500',
                    }}
                    >
                        AP {i+1}
                    </StyledTypography>
                </StyledAccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: "#ebebeb"}}>
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
    <div style={{ ...componentStyles, width: props.width, height: props.height, borderRadius: 10 }}>
        <StyledTypography variant="h6" component="div" sx={{padding: `${padding}px`}}>
            Summary of APs
        </StyledTypography>
        <div className="scroll" style={{ height: `${props.height-40-2*padding}px`}}>
        {apConfig.map((config, idx)=> {
            return DisplayAPConfig(idx, config);
        })}
        </div>
    </div>
    )
};
export default SummaryAP;
