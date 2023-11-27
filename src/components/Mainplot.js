import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import GraphPlot from './GraphPlot.js';
import SummaryAP from "./SummaryAP.js";
import SummaryDev from "./SummaryDev.js";
import ControlPanel from "./ControlPanel.js";
import TotalSummary from "./TotalSummary.js";
import { componentStyles } from "../common/StyledComponents.js";

import apdata from "../data/ap1_dummy.json";

const Mainplot = (props) => {

  const plotMargin = 30;
  const graphWidth = window.innerWidth*0.92;
  const graphHeight = window.innerHeight*0.3;
  const mainWidth = (window.innerWidth*0.92)*0.66;
  const mainHeight = window.innerHeight*0.9;
  const APWidth = (window.innerWidth*0.92)*0.32;
  const APHeight = (mainHeight-2*plotMargin)/2;
  const ControlWidth = APWidth;
  const ControlHeight = mainHeight;
  const padding = 10;
  const titleHeight = 35;
 
  const data = apdata.map(d => ({
    ...d, 
    "time": parseFloat(d.time),
    "section": parseInt(d.section), 
    "number": parseInt(d.number)
  }));
  console.log(data);
 
  const smainPlot = useRef(null);   
  const plotWidth = mainWidth-2*plotMargin-2*padding;
  const plotHeight = mainHeight-titleHeight-2*plotMargin-2*padding;   

  const criteria = [1.0, 5.0, 15.0, 25.0];
  const labels = ["veryPoor", "poor", "normal", "good", "veryGood"];
  const color = ["#FF0000", "#FF8000", "#FFD400", "#80FF00", "#009000"];
  
  useEffect(() => {
     
      const mainSvg = d3.select(smainPlot.current);
      const timeGap = data[1].time-data[0].time;

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
                            d3.max(data, d => d.time)+timeGap
                        ])
                        .range([0, plotWidth]);
    
      let yScale = d3.scaleLinear()
                      .domain([
                          0,
                          d3.max(data, d => d.number)
                      ])
                      .range([plotHeight, 0]);
      
      let xAxis = d3.axisBottom().scale(xScale);
      let yAxis = d3.axisLeft().scale(yScale);
    
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
        .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
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

      mainSvg.append("g")
      .attr("transform", `translate(${plotMargin}, ${plotHeight + plotMargin})`)
      .attr("id", "x-axis")
      .call(xAxis);
  
      mainSvg.append("g")
          .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
          .attr("id", "y-axis")
          .call(yAxis);

      
	}, []);
 
	return (
		<Grid container sx={{width: "100%", p: "4%"}}>
      <Grid item xs={12} sx={componentStyles}>
        <GraphPlot data={data} width={graphWidth} height={graphHeight} margin={plotMargin} titleHeight={titleHeight}/>
      </Grid>
      <Grid item xs={2} sx={{ display:"flex", flexDirection:"column", pr: "1%"}}>
        <SummaryAP width={APWidth} height={APHeight} margin={plotMargin} padding={padding}/>
        <SummaryDev apdata={data} width={APWidth} height={APHeight} margin={plotMargin} padding={padding}/>
      </Grid>
      <Grid item xs={8} sx={{ ...componentStyles, height: mainHeight, p: `${padding}px`}}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, fontSize: 20, fontWeight: "bold", maxHeight: titleHeight }}>
          The number of Devices
        </Typography>
        <svg ref={smainPlot} width={mainWidth} height={mainHeight}/> 
      </Grid>
      <Grid item xs={2} sx={{pl: "1%", height: mainHeight}}>
        <ControlPanel width={ControlWidth} height={ControlHeight} margin={plotMargin} padding={padding}/>
      </Grid>
      <Grid item xs={12} sx={componentStyles}>
        <TotalSummary width={graphWidth} height={50} margin={plotMargin}/>
      </Grid>
		</Grid>
	)
};
export default Mainplot;

//