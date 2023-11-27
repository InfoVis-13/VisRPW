import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StyledAccordionSummary, StyledTypography, componentStyles } from "../common/StyledComponents";

const SummaryDev = (props) => {
    
    const apData = props.apdata;
    const sPlot = useRef(null);
    
    const padding = props.padding;
    const criteria = [1.0, 5.0, 15.0, 25.0];
    const labels = ["veryPoor", "poor", "normal", "good", "veryGood"];
    const color = ["#FF0000", "#FF8000", "#FFD400", "#80FF00", "#009000"];

    useEffect(() => {  
        
        const sPlotSvg = d3.select(sPlot.current);

        let maxDev = 0;
        let devData = [];

        for (let i=0; i<apData.length; i++) {
            if(maxDev < apData[i]['number']) maxDev = apData[i]['number'];
        }

        for(let i=1; i<=maxDev; i++) {
            let devTput = 0.0;
            let cnt = 0;
            for(let j=0; j<apData.length; j++){
                if(apData[j][`sta${i}`] === -1.0) continue;
                devTput += apData[j][`sta${i}`];
                cnt++;
            }
            devData.push(devTput/cnt);
        }

        console.log(devData);

        let statsData = {
            "veryGood": 0,
            "good" : 0,
            "normal": 0,
            "poor" : 0,
            "veryPoor" : 0
        };

        for(let i=0; i<maxDev; i++) {
            let labIdx = 0;
            for(labIdx; labIdx<criteria.length; labIdx++){
                if(devData[i] <= criteria[labIdx]) break;
            }
            statsData[labels[labIdx]]++;
        }
    
        const plotData = labels.map((d,i)=> {
            return {
                "name" : d,
                "count": statsData[d],
                "ratio": (statsData[d]/maxDev)*100
            }
        });

        sPlotSvg.selectAll('rect')     
            .data(plotData)
            .enter()
            .append('rect')  
            .attr("x", 10)
            .attr("y",(d,i)=> 20*i+7)
            .attr("height", 17)
            .attr("width", 17)
            .attr("fill", (d,i)=>color[i]);

        sPlotSvg.selectAll('text')
            .data(plotData)
            .join('text')
            .attr("x",35)
            .attr("y",(d,i)=>20*(i+1)+1)
            .attr("font-size", 18)
            .text((d,i)=>`${d.name} - ${d.count} (${d.ratio}%)`);

    }, []);

	return (
    <div style={{ ...componentStyles, height: props.height, marginTop: 9.5, borderRadius: 10, padding:`${padding}px`}}>
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
    </div>
    )
};
export default SummaryDev;
