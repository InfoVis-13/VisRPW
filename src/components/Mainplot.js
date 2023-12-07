import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Grid from '@mui/material/Grid';

import GraphPlot from './GraphPlot.js';
import SummaryAP from "./SummaryAP.js";
import SummaryDev from "./SummaryDev.js";
import ControlPanel from "./ControlPanel.js";
import TotalSummary from "./TotalSummary.js";
import { componentStyles, StyledTypography } from "../common/StyledComponents.js";

import apdata from "../data/ap1_dummy.json";
import throughputAP1 from "../data/throughput_ap1.json";
import throughputAP2 from "../data/throughput_ap2.json";
import DataContext from './DataContext.js';
import TimeNumDevGroup from "./plots/TimeNumDevGroup.js";
import { Stack } from "@mui/material";

const Mainplot = (props) => {
  const dataContext = React.useContext(DataContext);

  const paddingW = window.innerWidth*0.015;
  const padding = 15;
  const entireWidth = window.innerWidth*0.97;
  const entireHeight = window.innerHeight-90;
  const leftGridInnerWidth = entireWidth*0.33-2*padding;
  const rightGridInnerWidth = entireWidth*0.66-2*padding; 
  const titleHeight = 35;
  const leftSubGridInnerHeight = (entireHeight-7.5*padding)/2;
  const plotMargin = 30;
  const mainHeight = entireHeight-2*padding;
  // const ControlWidth = APWidth;
  // const ControlHeight = mainHeight;

  const [numAps , setNumAps] = useState(2);
 
  const data = throughputAP1.map(d => {
    const number = parseInt(d.number);
    let sum = 0;
    let squareSum = 0;
    let cnt = 0;
    for (let i=1; ;i++) {
      if (d[`sta${i}`] === -1.0) continue;
      d[`sta${i}`] = parseFloat(d[`sta${i}`]);
      sum += d[`sta${i}`];
      squareSum += d[`sta${i}`]*d[`sta${i}`];
      cnt++;
      if (cnt === number) break;
    }
    return{
      ...d, 
      "time": parseFloat(d.time),
      "section": parseInt(d.section), 
      "number": number,
      "fairness": (sum*sum)/(cnt*squareSum),
      "total": parseFloat(d.total)
    }
  });
  console.log(data);
 
  const smainPlot = useRef(null);   
  const [timethreshold, settimeshow] = useState([-1,999999]);
  dataContext.setTimeShow = settimeshow; 
  
  useEffect(() => {
    
      const mainSvg = d3.select(smainPlot.current);

      // const statsData = data.map(d => {
      //     let eachData = {
      //         "time" : d.time,
      //         "number": d.number,
      //         "veryGood": 0,
      //         "good" : 0,
      //         "normal": 0,
      //         "poor" : 0,
      //         "veryPoor" : 0
      //     };
      //     let cnt = 0;
      //     for(let j=0; ; j++){
      //         if (d[`sta${j+1}`] === -1.0) continue;
      //         let labIdx = 0;
      //         for(labIdx; labIdx<criteria.length; labIdx++){
      //             if(d[`sta${j+1}`] <= criteria[labIdx]) break;
      //         }
      //         eachData[labels[labIdx]]++;
      //         cnt++;
      //         if (cnt === d.number) break;
      //     }
      //     return eachData;
      // }).filter(d => ((d.time >= timethreshold[0]) && (d.time <= timethreshold[1])));
      // console.log(statsData);

      // let xScale = d3.scaleLinear()
      // .domain([
      //     d3.min(statsData, d => d.time),
      //     d3.max(statsData, d => d.time)+timeGap
      // ])
      // .range([0, plotWidth]);

      // let yScale = d3.scaleLinear()
      // .domain([
      //   0,
      //   d3.max(statsData, d => d.number)
      // ])
      // .range([plotHeight, 0]);
      
      // mainSvg.selectAll(".mainrect").remove()

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
      //   mainSvg.append("g")
      //   .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
      //   .selectAll("rect")
      //   .data(plotData)
      //   .join("rect")
      //   .attr("class","mainrect")
      //   .attr("x", d => xScale(d.time))
      //   .attr("y", d => yScale(d.number))
      //   .attr("width", xScale(plotData[1].time)-xScale(plotData[0].time))
      //   .attr("height", d => yScale(0)-yScale(d.number))
      //   .attr("stroke", color[labIdx])
      //   .attr("fill", color[labIdx]);
      // }

      // let xAxis = d3.axisBottom().scale(xScale);
      // let yAxis = d3.axisLeft().scale(yScale);
    
      // mainSvg.select(".x-axis").remove()
      // mainSvg.select(".y-axis").remove()


      // mainSvg.append("g")
      // .attr("transform", `translate(${plotMargin}, ${plotHeight + plotMargin})`)
      // .attr("class", "x-axis")
      // .call(xAxis);
  
      // mainSvg.append("g")
      //     .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
      //     .attr("class", "y-axis")
      //     .call(yAxis);
      
	}, [timethreshold]);
 
	return (
		<Grid container sx={{width: "100%", pt: '20px', pl: `${paddingW}px`, pr: `${paddingW}px`}}>
      <Grid item xs={4}>
        <Stack spacing={`${padding}px`}>
          <Stack direction="row" spacing={`${padding}px`} useFlexGap flexWrap="wrap">
            <TotalSummary width={leftGridInnerWidth/2} height={leftSubGridInnerHeight} margin={plotMargin} padding={padding}/>
            <SummaryAP width={leftGridInnerWidth/2} height={leftSubGridInnerHeight} margin={plotMargin} padding={padding}/>
            <GraphPlot data={data} width={leftGridInnerWidth} height={leftSubGridInnerHeight} margin={plotMargin} titleHeight={titleHeight}/>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={8} sx={{ ...componentStyles, height: mainHeight, p: `${padding}px`}}>
        <StyledTypography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, maxHeight: titleHeight, backgroundColor: "rgba(0,0,0,0)" }}>
          The number of Devices
        </StyledTypography>
        <TimeNumDevGroup
          data={data}
          width={rightGridInnerWidth}
          height={mainHeight-titleHeight-2*padding}
          plotMargin={plotMargin}
        />
      </Grid>
		</Grid>
	)
};
export default Mainplot;

//...componentStyles, height: props.height, borderRadius: 10, padding: `${padding}px`