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
import DataContext from './DataContext.js';
import TimeNumDevGroup from "./plots/TimeNumDevGroup.js";

const Mainplot = (props) => {
  const dataContext = React.useContext(DataContext);

  const mainPadding = 15;
  const padding = 15;
  const titleHeight = 35;
  const interComponentMargin = (window.innerWidth*0.92)*0.01;
  const plotMargin = 30;
  const graphWidth = window.innerWidth*0.92;
  const graphHeight = window.innerHeight*0.3;
  const mainWidth = (window.innerWidth*0.92)*0.78;
  const mainHeight = window.innerHeight;
  const APWidth = (window.innerWidth*0.92)*0.2;
  const APHeight = (mainHeight-2*plotMargin)/2-padding;
  // const ControlWidth = APWidth;
  // const ControlHeight = mainHeight;

  const [numAps , setNumAps] = useState(2);
 
  const data = apdata.map(d => {
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
		<Grid container sx={{width: "100%", p: "4%"}}>
      <Grid item xs={12} sx={componentStyles}>
        <GraphPlot data={data} width={graphWidth} height={graphHeight} margin={plotMargin} titleHeight={titleHeight}/>
      </Grid>
      <Grid item xs={2.5} sx={{ display:"flex", flexDirection:"column", mr: `${interComponentMargin}px`}}>
        <SummaryAP width={APWidth} height={APHeight} margin={plotMargin} padding={padding}/>
        <ControlPanel width={APWidth} height={APHeight} margin={plotMargin} padding={padding}/>
        {/* <SummaryDev apdata={data} width={APWidth} height={APHeight} margin={plotMargin} padding={mainPadding}/> */}
      </Grid>
      <Grid item xs={9.36} sx={{ ...componentStyles, height: mainHeight, p: `${mainPadding}px`}}>
        <StyledTypography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, maxHeight: titleHeight }}>
          The number of Devices
        </StyledTypography>
        <TimeNumDevGroup
          data={data}
          width={mainWidth-2*mainPadding}
          height={mainHeight-titleHeight-2*mainPadding}
          plotMargin={plotMargin}
        />
        {/* <svg ref={smainPlot} width={mainWidth} height={mainHeight}/>  */}
      </Grid>
      {/* <Grid item xs={2} sx={{ ...componentStyles, ml: `${interComponentMargin}px`, height: ControlHeight, padding: `${mainPadding}px`}}>
        <ControlPanel width={ControlWidth} height={ControlHeight} margin={plotMargin} padding={padding}/>
      </Grid> */}
      <Grid item xs={12} sx={componentStyles}>
        <TotalSummary width={graphWidth} height={50} margin={plotMargin}/>
      </Grid>
		</Grid>
	)
};
export default Mainplot;

//...componentStyles, height: props.height, borderRadius: 10, padding: `${padding}px`