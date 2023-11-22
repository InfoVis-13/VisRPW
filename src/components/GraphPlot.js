import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Typography from '@mui/material/Typography';

const GraphPlot = (props) => {

    const data = props.data;
    const width = props.width/2-props.margin;
    const height = props.height;
    const margin = props.margin;
    
    const numDevPlot = useRef(null);
    const tputPlot = useRef(null);  

    useEffect(() => {
        
        const numDevSvg = d3.select(numDevPlot.current);
        const tputSvg = d3.select(tputPlot.current);

        const timeGap = data[1].time-data[0].time;
        let xScale = d3.scaleLinear()
                        .domain([
                            d3.min(data, d => d.time),
                            d3.max(data, d => d.time)+timeGap
                        ])
                        .range([0, width]);
    
        let yScale = d3.scaleLinear()
                      .domain([
                          0,
                          d3.max(data, d => d.number)
                      ])
                      .range([height, 0]);
        let xAxis = d3.axisBottom().scale(xScale);
        let yAxis = d3.axisLeft()
                        .scale(yScale)
                        .ticks(5);
                      
        numDevSvg.append("g")
            .attr("transform", `translate(${margin}, ${margin})`)
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => xScale(d.time))
            .attr("y", d => yScale(d.number))
            .attr("width", xScale(data[1].time)-xScale(data[0].time))
            .attr("height", d => yScale(0)-yScale(d.number))
            .attr("fill", "steelblue")
            .attr("stroke", "steelblue");

        numDevSvg.append("g")
            .attr("transform", `translate(${margin}, ${height + margin})`)
            .call(xAxis);
        
        numDevSvg.append("g")
            .attr("transform", `translate(${margin}, ${margin})`)
            .call(yAxis);

        let tputYScale = d3.scaleLinear()
                        .domain([
                            0,
                            d3.max(data, d => d["total throughput"])+30
                        ])
                        .range([height, 0]);

        let tputYAxis = d3.axisLeft()
                        .scale(tputYScale)
                        .ticks(5);
        
        const line = d3.line()
                        .x(d => xScale(d.time))
                        .y(d => tputYScale(d["total throughput"]))
                        .curve(d3.curveLinear);
        
        tputSvg.append("g")
            .attr("transform", `translate(${margin}, ${height + margin})`)
            .call(xAxis);
        
        tputSvg.append("g")
            .attr("transform", `translate(${margin}, ${margin})`)
            .call(tputYAxis);

        tputSvg.append("path")
            .attr("transform", `translate(${margin}, ${margin})`)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("d", line(data));
        
    }, []);

	return (
    <div style={{display:"flex", border:"2px solid lightgray", borderRadius: 8, padding: 2, backgroundColor:"whitesmoke"}}>
        <div style={{marginLeft: 5}}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, fontSize: 18 }}>
                The number of Devices
            </Typography>
            <svg ref={numDevPlot} width={width+2*margin} height={height+2*margin}/>
        </div>
        <div style={{marginLeft: margin-5}}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, fontSize: 18 }}>
                Total Throughput
            </Typography>
            <svg ref={tputPlot} width={width+2*margin} height={height+2*margin}/>        
        </div>
    </div>
    )

    function LineChart(data, {
        x = ([x]) => x, // given d in data, returns the (temporal) x-value
        y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
        defined, // for gaps in data
        curve = d3.curveLinear, // method of interpolation between points
        marginTop = 20, // top margin, in pixels
        marginRight = 30, // right margin, in pixels
        marginBottom = 30, // bottom margin, in pixels
        marginLeft = 40, // left margin, in pixels
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        xType = d3.scaleUtc, // the x-scale type
        xDomain, // [xmin, xmax]
        xRange = [marginLeft, width - marginRight], // [left, right]
        yType = d3.scaleLinear, // the y-scale type
        yDomain, // [ymin, ymax]
        yRange = [height - marginBottom, marginTop], // [bottom, top]
        yFormat, // a format specifier string for the y-axis
        yLabel, // a label for the y-axis
        color = "currentColor", // stroke color of line
        strokeLinecap = "round", // stroke line cap of the line
        strokeLinejoin = "round", // stroke line join of the line
        strokeWidth = 1.5, // stroke width of line, in pixels
        strokeOpacity = 1, // stroke opacity of line
      } = {}) {
        // Compute values.
        const X = d3.map(data, x);
        const Y = d3.map(data, y);
        const I = d3.range(X.length);
        if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
        const D = d3.map(data, defined);
      
        // Compute default domains.
        if (xDomain === undefined) xDomain = d3.extent(X);
        if (yDomain === undefined) yDomain = [0, d3.max(Y)];
      
        // Construct scales and axes.
        const xScale = xType(xDomain, xRange);
        const yScale = yType(yDomain, yRange);
        const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale).ticks(height / 40);
      
        // Construct a line generator.
        const line = d3.line()
            .defined(i => D[i])
            .curve(curve)
            .x(i => xScale(X[i]))
            .y(i => yScale(Y[i]));
      
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
      
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis);
      
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(yLabel));
      
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-linejoin", strokeLinejoin)
            .attr("stroke-opacity", strokeOpacity)
            .attr("d", line(I));
      
        return svg.node();
      }
};
export default GraphPlot;
