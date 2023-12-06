import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import DataContext from './DataContext.js';

import { StyledTypography } from "../common/StyledComponents.js";

const GraphPlot = (props) => {

    const dataContext = React.useContext(DataContext);

    const data = props.data;
    const margin = props.margin;
    const padding = 10;
    const titleHeight = props.titleHeight;
    const width = props.width/2-2*padding;
    const height = props.height - titleHeight -2*padding;
    const plotWidth = width-3*margin;
    const plotHeight = height-2*margin;

    const numDevPlot = useRef(null);
    const tputPlot = useRef(null);

    const brushLeft = d3.brushX()
    .extent([[0, 0], [plotWidth, plotHeight]])
    .on("start brush end", brushedLeft);

    const brushRight = d3.brushX()
    .extent([[0, 0], [plotWidth, plotHeight]])
    .on("start brush end", brushedRight);

    let reverseXscale = d3.scaleLinear()
    .domain([0, plotWidth])
    .range([
        d3.min(data, d => d.time),
        d3.max(data, d => d.time)+(data[1].time-data[0].time)
    ]);

    var leftbrushdoing = false;
    var rightbrushdoing = false;

    function brushedLeft({selection}) {
        if (leftbrushdoing === true)
            return;
        leftbrushdoing = true;
        if (selection === null) {
          // init
        }
        else {
            let [x0, x1] = selection;
            let datax0 = reverseXscale(x0)
            let datax1 = reverseXscale(x1)

            d3.select(".brushRight")
                .call(brushRight.move,[x0,x1])

            if(datax1 - datax0 > 1)
            {
            dataContext.setTimeShow([datax0,datax1]) 
            }
        }
        leftbrushdoing = false;
    }

    function brushedRight({selection}) {
        if (rightbrushdoing === true)
            return;
        rightbrushdoing = true;
        if (selection === null) {
          // init
        }
        else {
            let [x0, x1] = selection;
            let datax0 = reverseXscale(x0)
            let datax1 = reverseXscale(x1)
            d3.select(".brushLeft")
                .call(brushLeft.move,[x0,x1])

            if(datax1 - datax0 > 1){
                dataContext.setTimeShow([datax0,datax1])
            }
        }
        rightbrushdoing = false;
    }

    useEffect(() => {

        const numDevSvg = d3.select(numDevPlot.current);
        const tputSvg = d3.select(tputPlot.current);

        const timeGap = data[1].time-data[0].time;
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
        let yAxis = d3.axisLeft()
                        .scale(yScale)
                        .ticks(5);

        // numDevSvg.append("g")
        //     .attr("transform", `translate(${margin}, ${margin})`)
        //     .selectAll("rect")
        //     .data(data)
        //     .join("rect")
        //     .attr("x", d => xScale(d.time))
        //     .attr("y", d => yScale(d.number))
        //     .attr("width", xScale(data[1].time)-xScale(data[0].time))
        //     .attr("height", 0.1)
        //     .attr("fill", "black")
        //     .attr("stroke", "black");

        const lineLeft = d3.line()
                        .x(d => xScale(d.time))
                        .y(d => yScale(d.number))
                        .curve(d3.curveLinear);

        numDevSvg.append("path")
            .attr("transform", `translate(${margin}, ${margin})`)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", lineLeft(data));

        numDevSvg.append("g")
            .attr("transform", `translate(${margin}, ${plotHeight + margin})`)
            .call(xAxis);

        numDevSvg.append("g")
            .attr("transform", `translate(${margin}, ${margin})`)
            .call(yAxis);

        let tputYScale = d3.scaleLinear()
                        .domain([
                            0,
                            d3.max(data, d => d["total throughput"])+30
                        ])
                        .range([plotHeight, 0]);

        let tputYAxis = d3.axisLeft()
                        .scale(tputYScale)
                        .ticks(5);

        const line = d3.line()
                        .x(d => xScale(d.time))
                        .y(d => tputYScale(d["total throughput"]))
                        .curve(d3.curveLinear);

        tputSvg.append("g")
            .attr("transform", `translate(${margin}, ${plotHeight + margin})`)
            .call(xAxis);

        tputSvg.append("g")
            .attr("transform", `translate(${margin}, ${margin})`)
            .call(tputYAxis);

        tputSvg.append("path")
            .attr("transform", `translate(${margin}, ${margin})`)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("d", line(data));

        d3.select(numDevPlot.current).append('g')
        .attr('class', 'brushLeft')
        .attr('transform', `translate(${margin},${margin})`)
        .attr("id", "brushLeft")
        .call(brushLeft)

        d3.select(tputPlot.current).append('g')
        .attr('class', 'brushRight')
        .attr('transform', `translate(${margin},${margin})`)
        .attr("id", "brushRight")
        .call(brushRight)

    }, []);

	return (
    <div style={{display:"flex"}}>
        <div style={{padding: padding}}>
            <StyledTypography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, maxHeight: titleHeight }}>
                The number of Devices
            </StyledTypography>
            <svg ref={numDevPlot} width={width} height={height}/>
        </div>
        <div style={{padding: padding}}>
            <StyledTypography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, maxHeight: titleHeight }}>
                Total Throughput
            </StyledTypography>
            <svg ref={tputPlot} width={width} height={height}/>
        </div>
    </div>
    )
};
export default GraphPlot;
