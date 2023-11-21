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
 
  const data = apdata.map(d => ({
    ...d, 
    time: parseFloat(d.time),
    section: parseInt(d.section), 
    number: parseInt(d.number)
  }));
  console.log(data);
 
  const smainPlot = useRef(null);      

  const criteria = [1.0, 5.0, 15.0, 25.0];
  const labels = ["veryPoor", "poor", "normal", "good", "veryGood"];
  const color = ["#FF0000", "#FF8000", "#FFD400", "#80FF00", "#009000"];
  
  useEffect(() => {
     
      const mainSvg = d3.select(smainPlot.current);

      const statsData = data.map(d => {
          let eachData = {
              "time" : d.time,
              "number": d.number,
              "veryGood": 0,
              "good" : 0,
              "normal": 0,
              "poor" : 0,
              "veryPoor" : 0
          };
          let cnt = 0;
          for(let j=0; ; j++){
              if (d[`sta${j+1}`] === -1.0) continue;
              let labIdx = 0;
              for(labIdx; labIdx<criteria.length; labIdx++){
                  if(d[`sta${j+1}`] <= criteria[labIdx]) break;
              }
              eachData[labels[labIdx]]++;
              cnt++;
              if (cnt === d.number) break;
          }
          return eachData;
      });
      console.log(statsData);
      
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
      
      let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      
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
      
      // mainSvg.append("g")
      //     .attr("transform", `translate(${margin}, ${margin})`)
      //     .selectAll("circle")
      //     .data(data)
      //     .join("circle")
      //     .attr("cx", d => xScale(d.time))
      //     .attr("cy", d => yScale(d.number))
      //     .attr("r", 2)
      //     .attr("fill", "steelblue");
      
      // for(let i=0; i<labels.length; i++) {
      //     mainSvg.append("g")
      //     .attr("transform", `translate(${margin}, ${margin})`)
      //     .selectAll("circle")
      //     .data(statsData)
      //     .join("circle")
      //     .attr("cx", d => xScale(d.time))
      //     .attr("cy", d => yScale(d[labels[i]]))
      //     .attr("r", 2)
      //     .attr("fill", colorScale(i));
      // }
                           
      // const area = d3.area()
      //               .x0((d, i) => xScale(d.time))
      //               .x1((d, i) => xScale(d.time))
      //               .y0(yScale(0))
      //               .y1(d => yScale(d.number))
      //               .curve(d3.curveLinear);
      
      // mainSvg.append("path")
      //   .attr("transform", `translate(${margin}, ${margin})`)
      //   .attr("fill", "steelblue")
      //   .attr("stroke", "steelblue")
      //   .attr("stroke-width", 1.5)
      //   .attr("d", area(data));
      
      // for(let labIdx=labels.length-1; labIdx>=0; labIdx--) {
      //   const plotData = statsData.map(d => {
      //     let cumulativeVal = 0;
      //     for(let j=labIdx; j>=0; j--) {
      //       cumulativeVal += d[labels[j]];
      //     }
      //     return {
      //       "time": d.time,
      //       "number": cumulativeVal
      //     };
      //   });
      //   console.log(plotData);
      //   mainSvg.append("path")
      //   .attr("transform", `translate(${margin}, ${margin})`)
      //   .attr("fill", colorScale(labIdx))
      //   .attr("stroke", colorScale(labIdx))
      //   // .attr("stroke-width", 1.5)
      //   .attr("d", area(plotData));
      // }

      for(let labIdx=labels.length-1; labIdx>=0; labIdx--) {
        const plotData = statsData.map(d => {
          let cumulativeVal = 0;
          for(let j=labIdx; j>=0; j--) {
            cumulativeVal += d[labels[j]];
          }
          return {
            "time": d.time,
            "number": cumulativeVal
          };
        });
        console.log(plotData);
        mainSvg.append("g")
        .attr("transform", `translate(${margin}, ${margin})`)
        .selectAll("rect")
        .data(plotData)
        .join("rect")
        .attr("x", d => xScale(d.time))
        .attr("y", d => yScale(d.number))
        .attr("width", xScale(plotData[1].time)-xScale(plotData[0].time))
        .attr("height", d => yScale(0)-yScale(d.number))
        .attr("stroke", color[labIdx])
        .attr("fill", color[labIdx]);
      }


      
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
            <SummaryDev apdata={data} width={APWidth} height={APHeight}/>
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
        <TotalSummary width={graphWidth} height={50}/>
      </div> 
		</div>
	)
};
export default Mainplot;

//