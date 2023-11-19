import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import GraphPlot from './GraphPlot.js'
import DataContext from './DataContext.js';
import SummaryAP from "./SummaryAP.js";
import SummaryDev from "./SummaryDev.js";
import ControlPanel from "./ControlPanel.js";
import TotalSummary from "./TotalSummary.js";

import apdata from "../data/ap1_dummy.json";

const margin = 25;
const graphWidth = 1000;
const graphHeight = 200;
const mainWidth = 500;
const mainHeight = 500;
const APWidth = 200;
const APHeight = 250;
const ControlWidth = 300;
const ControlHeight = 500;

const Mainplot = (props) => {
 
  const dataContext = React.useContext(DataContext);
 
  const smainPlot = useRef(null);      
  const graphref = GraphPlot({width:{graphWidth}, height:{graphHeight}});

  	useEffect(() => {
     
      console.log("main plot")
      d3.select(smainPlot.current)
      .selectAll('rect')
      .data([1234])
      .enter()
      .append('rect') 
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", mainHeight)
      .attr("width", mainWidth)
      .attr("fill", 'red')

      d3.select(smainPlot.current)
      .selectAll('text')     
      .data([1234])
      .enter()
      .append('text')  
      .attr("x", 20)
	    .attr("y", 20)
      .text("Main Plot")
      
	}, []);
 
	return (
		<div>
      <div style={{marginLeft: margin, marginTop: margin, width:graphWidth, height: graphHeight}}>
        <GraphPlot apdata={apdata} width={graphWidth} height={graphHeight}/>
      </div> 
      <div style={{ display:"flex"}}>
        <div style={{marginLeft: margin, marginTop: margin, width:APWidth, height: APHeight}}>
            <SummaryAP width={APWidth} height={APHeight}/>
            <SummaryDev width={APWidth} height={APHeight}/>
        </div>
        <div style={{marginLeft: (margin), marginTop: margin, width:mainWidth, height: mainHeight}}>
          <svg ref={smainPlot} width={mainWidth} height={mainHeight}> 
          </svg>      
        </div>
        <div style={{marginLeft: margin, marginTop: margin, width:ControlWidth, height: ControlHeight}}>
            <ControlPanel width={ControlWidth} height={ControlHeight}/>
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