import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import DataContext from './DataContext.js';

const SummaryDev = (props) => {
    
    const apData = props.apdata;
    const sPlot = useRef(null);
    
    const criteria = [1.0, 5.0, 15.0, 25.0];
    const labels = ["veryPoor", "poor", "normal", "good", "veryGood"];

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
            .attr("y",(d,i)=> 20*i+30)
            .attr("height", 17)
            .attr("width", 17)
            .attr("fill", "red");

        sPlotSvg.selectAll('text')
            .data(plotData)
            .join('text')
            .attr("x",40)
            .attr("y",(d,i)=>20*(i+1)+28)
            .text((d,i)=>`${d.name} - ${d.count} (${d.ratio}%)`);

    }, []);

	return (
    <div style={{marginTop: 9.5 ,border: '1px dashed'}}>
        <svg ref={sPlot} width={props.width} height={props.height} />  
    </div>
    )
};
export default SummaryDev;
