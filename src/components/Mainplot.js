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

const Mainplot = (props) => {
  const dataContext = React.useContext(DataContext);

  const plotMargin = 30;
  const graphWidth = window.innerWidth*0.92;
  const graphHeight = window.innerHeight*0.3;
  const mainWidth = (window.innerWidth*0.92)*0.63;
  const mainHeight = window.innerHeight*0.9;
  const APWidth = (window.innerWidth*0.92)*0.16;
  const APHeight = (mainHeight-2*plotMargin)/2;
  const ControlWidth = APWidth;
  const ControlHeight = mainHeight;
  const padding = 10;
  const titleHeight = 35;
  const interComponentMargin = (window.innerWidth*0.92)*0.015;
 
  const data = apdata.map(d => {
    const number = parseInt(d.number);
    let sum = 0;
    let squareSum = 0;
    let cnt = 0;
    for (let i=1; ;i++) {
      if (d[`sta${i}`] === -1.0) continue;
      // console.log(d[`sta${i}`]);
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
  const plotWidth = mainWidth-2*plotMargin-2*padding;
  const plotHeight = mainHeight-titleHeight-2*plotMargin-2*padding;   

  const criteria = [1.0, 5.0, 15.0, 25.0];
  const labels = ["veryPoor", "poor", "normal", "good", "veryGood"];
  const labelColor = ["#FF0000", "#FF8000", "#FFD400", "#80FF00", "#009000"];
  
  useEffect(() => {
    
      const mainSvg = d3.select(smainPlot.current);
      const timeGap = data[1].time-data[0].time;

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

      let statsData = [];

      for(let i=0; i<data.length; i++) {
        let d = data[i];
        let eachData = {
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
        for (let j=0; j<labels.length; j++) {
          statsData.push({
            "time": d.time,
            "number": d.number,
            "label": labels[j],
            "count": eachData[labels[j]]
          });
        }
      }
          
      statsData.filter(d => ((d.time >= timethreshold[0]) && (d.time <= timethreshold[1])));
      console.log(statsData);

      // Determine the series that need to be stacked.
      const series = d3.stack()
        .keys(d3.union(statsData.map(d => d.label))) // distinct series keys, in input order
        .value(([, D], key) => D.get(key).count) // get value for each series key and stack
      (d3.index(statsData, d => d.time, d => d.label)); // group by stack then series key

      // Prepare the scales for positional and color encodings.
      const x = d3.scaleUtc()
        .domain([
              d3.min(statsData, d => d.time),
              d3.max(statsData, d => d.time)+timeGap
        ])
        // .domain(d3.extent(statsData, d => d.time))
        .range([0, plotWidth]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .rangeRound([plotHeight, 0]);

      const color = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(labelColor);
        // .range(d3.schemeTableau10);

      // Construct an area shape.
      const area = d3.area()
        .x(d => x(d.data[0]))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]));

      // Add the y-axis, remove the domain line, add grid lines and a label.
      mainSvg.append("g")
        .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
        .call(d3.axisLeft(y).ticks(plotHeight / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", plotWidth)
            .attr("stroke-opacity", 0.1));
        // .call(g => g.append("text")
        //     .attr("x", -plotMargin)
        //     .attr("y", 10)
        //     .attr("fill", "currentColor")
        //     .attr("text-anchor", "start")
        //     .text("↑ Number of Devices"));

      // Append a path for each series.
      mainSvg.append("g")
      .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
      .selectAll()
      .data(series)
      .join("path")
        .attr("fill", d => color(d.key))
        .attr("d", area)
      .append("title")
        .text(d => d.key);

      // Append the horizontal axis atop the area.
      mainSvg.append("g")
        .attr("transform", `translate(${plotMargin}, ${plotHeight + plotMargin})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));
      
	}, [timethreshold]);
 
	return (
		<Grid container sx={{width: "100%", p: "4%"}}>
      <Grid item xs={12} sx={componentStyles}>
        <GraphPlot data={data} width={graphWidth} height={graphHeight} margin={plotMargin} titleHeight={titleHeight}/>
      </Grid>
      <Grid item xs={2} sx={{ display:"flex", flexDirection:"column", mr: `${interComponentMargin}px`}}>
        <SummaryAP width={APWidth} height={APHeight} margin={plotMargin} padding={padding}/>
        <SummaryDev apdata={data} width={APWidth} height={APHeight} margin={plotMargin} padding={padding}/>
      </Grid>
      <Grid item xs={7.6} sx={{ ...componentStyles, height: mainHeight, p: `${padding}px`}}>
        <StyledTypography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, fontSize: 20, fontWeight: "bold", maxHeight: titleHeight }}>
          The number of Devices
        </StyledTypography>
        <svg ref={smainPlot} width={mainWidth} height={mainHeight}/> 
      </Grid>
      <Grid item xs={2} sx={{ ...componentStyles, ml: `${interComponentMargin}px`, height: ControlHeight, padding: `${padding}px`}}>
        <ControlPanel width={ControlWidth} height={ControlHeight} margin={plotMargin} padding={padding}/>
      </Grid>
      <Grid item xs={12} sx={componentStyles}>
        <TotalSummary width={graphWidth} height={50} margin={plotMargin}/>
      </Grid>
		</Grid>
	)
};
export default Mainplot;

//...componentStyles, height: props.height, borderRadius: 10, padding: `${padding}px`