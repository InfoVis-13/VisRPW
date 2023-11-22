import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import GraphPlot from './GraphPlot.js';
import SummaryAP from "./SummaryAP.js";
import SummaryDev from "./SummaryDev.js";
import ControlPanel from "./ControlPanel.js";
import TotalSummary from "./TotalSummary.js";

import apdata from "../data/ap1_dummy.json";

const margin = 30;
const graphWidth = 1040;
const graphHeight = 200;
const mainWidth = 590;
const mainHeight = 590;
const APWidth = 200;
const APHeight = 320;
const ControlWidth = 250;
const ControlHeight = 590;

const Mainplot = (props) => {
 
  const data = apdata.map(d => ({
    ...d, 
    "time": parseFloat(d.time),
    "section": parseInt(d.section), 
    "number": parseInt(d.number)
  }));
  console.log(data);
 
  const smainPlot = useRef(null);      

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
                        .range([0, mainWidth]);
    
      let yScale = d3.scaleLinear()
                      .domain([
                          0,
                          d3.max(data, d => d.number)
                      ])
                      .range([mainHeight, 0]);
      
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

      mainSvg.append("g")
      .attr("transform", `translate(${margin}, ${mainHeight + margin})`)
      .attr("id", "x-axis")
      .call(xAxis);
  
      mainSvg.append("g")
          .attr("transform", `translate(${margin}, ${margin})`)
          .attr("id", "y-axis")
          .call(yAxis);

      
	}, []);
 
	return (
		<div>
      <Box sx={{ flexGrow: 1, marginBottom: 5 }}>
      <AppBar position="static" sx={{width: "100%", backgroundColor: "#003458"}}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            VisRPW
          </Typography>
        </Toolbar>
      </AppBar>
      </Box>
      <div style={{marginLeft: margin, marginTop: margin, width:graphWidth+4*margin, height: graphHeight+2*margin+50}}>
        <GraphPlot data={data} width={graphWidth} height={graphHeight} margin={margin}/>
      </div> 
      <div style={{ display:"flex"}}>
        <div style={{marginLeft: margin, marginTop: margin, width:APWidth, height: APHeight*2}}>
            <SummaryAP width={APWidth} height={APHeight}/>
            <SummaryDev apdata={data} width={APWidth} height={APHeight}/>
        </div>
        <div style={{
            marginLeft: (margin), 
            marginTop: margin, 
            width:mainWidth+2*margin, 
            height: mainHeight+2*margin,  
            backgroundColor:"whitesmoke",
            border:"2px solid lightgray",
            borderRadius: 8,
          }}>
          <svg ref={smainPlot} width={mainWidth+2*margin} height={mainHeight+2*margin}> 
          </svg>      
        </div>
        <div style={{marginLeft: margin, marginTop: margin, width:ControlWidth, height: ControlHeight+2*margin}}>
            <ControlPanel width={ControlWidth} height={ControlHeight} margin={margin}/>
        </div>
      </div>
      <div style={{marginLeft: margin, marginTop: margin, width:graphWidth+4*margin, height: graphHeight}}>
        <TotalSummary width={graphWidth+4*margin} height={50} margin={margin}/>
      </div> 
		</div>
	)
};
export default Mainplot;

//