import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import config from '../data/config.json';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StyledTypography, StyledAccordionSummary, componentStyles } from "../common/StyledComponents.js";

const SummaryAP = (props) => {
    
    const padding = props.padding;
    const sPlot = useRef(null);  

    useEffect(() => {       

        console.log( config );

        const arrtext = [];
        let confkeys = Object.keys(config)
        for (let i = 0; i < confkeys.length; i++)
        {
               //arrtext.push(confkeys[i])
               let contents = Object.keys(config[confkeys[i]]);
               console.log(contents);
               for(let j = 0; j < contents.length; j++)
               {
                    arrtext.push(contents[j] + " : " + config[confkeys[i]][contents[j]]);
               }
               break;
        }

        var textheight = 0;

        d3.select(sPlot.current)
        .selectAll('text')
        .data(arrtext)
        .join('text')        
        // .attr("x",20)
        .attr("x", 7)
        .attr("y",(d,i)=>{textheight += 20; return textheight;})
        .text((d,i)=>d)
        .attr("font-size", 16)
        //.style("font-size", "10px")

    }, []);

	return (
    <div style={{ ...componentStyles, height: props.height, borderRadius: 15, padding:`${padding}px`}}>
        <Accordion sx={{ boxShadow:"none" }} defaultExpanded={true}>
            <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="AP1-content"
                id="AP1-header"
            >
                <StyledTypography>AP 1</StyledTypography>
            </StyledAccordionSummary>
            <AccordionDetails sx={{ p: 1}}>
                <svg ref={sPlot} width={props.width} height={props.height/2} />  
            </AccordionDetails>
        </Accordion>
        <Accordion style={{display:"none"}} sx={{ boxShadow:"none" }} defaultExpanded={true}>
            <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="AP2-content"
                id="AP2-header"
            >
                <StyledTypography>AP 2</StyledTypography>
            </StyledAccordionSummary>
            
        </Accordion>
        <Accordion style={{display:"none"}} sx={{ boxShadow:"none" }} defaultExpanded={true}>
            <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="AP3-content"
                id="AP3-header"
            >
                <StyledTypography>AP 3</StyledTypography>
            </StyledAccordionSummary>
            
        </Accordion>
    </div>
    )
};
export default SummaryAP;
