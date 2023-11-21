import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import GraphPlot from './GraphPlot.js'
import DataContext from './DataContext.js';
import SummaryAP from "./SummaryAP.js";
import SummaryDev from "./SummaryDev.js";
import ControlPanel from "./ControlPanel.js";
import TotalSummary from "./TotalSummary.js";

import apdata from "../data/ap1_dummy.json";

const margin = 20;
const graphWidth = 1040;
const graphHeight = 200;
const mainWidth = 510;
const mainHeight = 510;
const APWidth = 200;
const APHeight = 270;
const ControlWidth = 250;
const ControlHeight = 510;

const Mainplot = (props) => {
 
  const data = apdata.map(d => ({...d, number: parseInt(d.number)}));
  console.log(data);
 
  const smainPlot = useRef(null);      

  const criteria = [1.0, 5.0, 15.0, 25.0];
  const labels = ["veryPoor", "poor", "normal", "good", "veryGood"];
  const color = ["#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00"];
  
  useEffect(() => {
     
      const mainSvg = d3.select(smainPlot.current);
      
      let xScale = d3.scaleLinear()
                        .domain([
                            d3.min(data, d => d.time),
                            d3.max(data, d => d.time)
                        ])
                        .range([0, mainWidth]);
    
      let yScale = d3.scaleLinear()
                      .domain([
                          0,
                          d3.max(data, d => d.number)
                      ])
                      .range([mainHeight, 0]);
      
      let xAxis = d3.axisBottom().scale(xScale);
      let yAxis = d3.axisLeft().scale(yScale);
      
      mainSvg.append("g")
      .attr("transform", `translate(${margin}, ${mainHeight + margin})`)
      .attr("id", "x-axis")
      .call(xAxis);
  
      mainSvg.append("g")
          .attr("transform", `translate(${margin}, ${margin})`)
          .attr("id", "y-axis")
          .call(yAxis);
      
      mainSvg.append("g")
          .attr("transform", `translate(${margin}, ${margin})`)
          .selectAll("circle")
          .data(data)
          .join("circle")
          .attr("cx", d => xScale(d.time))
          .attr("cy", d => yScale(d.number))
          .attr("r", 2)
          .attr("fill", "steelblue");
                           
      const line = d3.line()
                      .defined(i => data[i])
                  
                      .x(d => xScale(d.time))
                      .y(d => yScale(d.number));
      
      mainSvg.append("g")
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);
      
	}, []);
 
	return (
		<div>
      <h1>VisRPW</h1>
      <div style={{marginLeft: margin, marginTop: margin, width:graphWidth, height: graphHeight}}>
        <GraphPlot apdata={apdata} width={graphWidth} height={graphHeight}/>
      </div> 
      <div style={{ display:"flex"}}>
        <div style={{marginLeft: margin, marginTop: margin, width:APWidth, height: APHeight*2}}>
            <SummaryAP width={APWidth} height={APHeight}/>
            <SummaryDev apdata={apdata} width={APWidth} height={APHeight}/>
        </div>
        <div style={{marginLeft: (margin), marginTop: margin, width:mainWidth+2*margin, height: mainHeight+2*margin}}>
          <svg ref={smainPlot} width={mainWidth+2*margin} height={mainHeight+2*margin}> 
          </svg>      
        </div>
        <div style={{marginLeft: margin, marginTop: margin, width:ControlWidth, height: ControlHeight+2*margin}}>
            <ControlPanel width={ControlWidth} height={ControlHeight} margin={margin}/>
        </div>
      </div>
      <div style={{marginLeft: margin, marginTop: margin, width:graphWidth, height: graphHeight}}>
        <TotalSummary width={graphWidth} height={graphHeight}/>
      </div> 
		</div>
	)
};
export default Mainplot;

//