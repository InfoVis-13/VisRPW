import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import DataContext from './DataContext.js';

import config from '../data/config.json';
import withStyles from '@mui/styles/withStyles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledAccordionSummary = withStyles({
    fontWeight: "bold",
    root: {
        minHeight: 30,
        maxHeight: 30,
        marginTop: 5,
        '&.Mui-expanded': {
          minHeight: 30,
          maxHeight: 30,
        }
    },
    content: {
        margin: 0,
        '&.Mui-expanded': {
          margin: 0
        }
    },
    expandIcon: {
        order: -1
    }
    })(AccordionSummary);

const StyledTypography = withStyles({
    root: {
        fontSize: 16,
        fontWeight: "bold",
    }
})(Typography);

const SummaryAP = (props) => {
    
    const dataContext = React.useContext(DataContext);
    
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
        .attr("x",20)
        .attr("y",(d,i)=>{textheight += 20; return textheight;})
        .text((d,i)=>d)
        .attr("font-size", 15)
        //.style("font-size", "10px")

    }, []);

	return (
    <div style={{border:"2px solid lightgray", width: props.width, height: props.height, borderRadius: 8, backgroundColor:"white"}}>
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
