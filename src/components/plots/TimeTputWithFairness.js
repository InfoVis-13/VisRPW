import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { apColor } from "../../common/Constants";

const TimeTputWithFairness = (props) => {

    const data = props.data;
    const plot = useRef(null);

    const width = props.width;
    const height = props.height;
    const plotMargin = props.plotMargin;
    const titleHeight = props.titleHeight;

    const plotWidth = width-2*plotMargin;
    const plotHeight = height-3*plotMargin-titleHeight; 
    const marginTop = 2*plotMargin;   

    const color = d3.schemeAccent;

    useEffect(() => {
        console.log(data);
        const plotSvg = d3.select(plot.current);
        const timeGap = data[1].time-data[0].time;

        // Add a container for each series.
        const groupedData = d3.group(data, d => d.key);
        const numAps = groupedData.size;
        
        let xScale = d3.scaleLinear()
                        .domain([
                            d3.min(data, d => d.time),
                            d3.max(data, d => d.time)+timeGap-1
                        ])
                        .range([0, plotWidth]);
        let tputYScale = d3.scaleLinear()
                        .domain([
                            0,
                            d3.max(data, d => d.total)+5
                        ])
                        .range([plotHeight, 0]);
        let devYScale = d3.scaleLinear()
                        .domain([
                            0,
                            d3.max(data, d => d.number)*2+3
                        ])
                        .range([plotHeight, 0]);
        let xAxis = d3.axisBottom().scale(xScale);
        let tputYAxis = d3.axisLeft()
                        .scale(tputYScale)
                        .ticks(10);
        let devYAxis = d3.axisRight()
                        .scale(devYScale)
                        .ticks(10);

        // const line = d3.line()
        //                 .x(d => xScale(d.time))
        //                 .y(d => tputYScale(d.value))
        //                 .curve(d3.curveLinear);

        // Append number of devices line
        let idx=0;
        const barWidth = (xScale(data[1].time)-xScale(data[0].time))/3*2/numAps;
        for (let value of groupedData.values()) {
            plotSvg.append("g")
                .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                .selectAll("rect")
                .data(value)
                .join("rect")
                .attr("x", d => xScale(d.time)-barWidth/2+(barWidth*idx))
                // .attr("y", 1)
                .attr("y", d=> devYScale(d.number))
                .attr("width", barWidth)
                // .attr("height", d=> devYScale(d.number))
                .attr("height", d=> plotHeight-devYScale(d.number))
                .attr("fill", apColor[2][idx])
                .attr("stroke", apColor[2][idx]);
            idx++;
        }

        const serie = plotSvg.append("g")
                        .selectAll()
                        .data(groupedData)
                        .join("g");
        
        // Append total throughput line
        serie.append("path")
                .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                .attr("fill", "none")
                .attr("stroke", (d, i) => apColor[1][i])
                .attr("stroke-width", 3)
                .attr("d", d => d3.line()
                        .x(d => xScale(d.time))
                        .y(d => tputYScale(d.total))
                        .curve(d3.curveLinear)(d[1]));
        
        // Append average throughput line
        serie.append("path")
                .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                .attr("fill", "none")
                .attr("stroke", (d, i) => apColor[0][i])
                .attr("stroke-width", 3)
                .attr("d", d => d3.line()
                        .x(d => xScale(d.time))
                        .y(d => tputYScale(d.avg))
                        .curve(d3.curveLinear)(d[1]));

            
        // plotSvg.append("g")
        //         .attr("transform", `translate(${plotMargin}, ${plotHeight/2 + plotMargin})`)
        //         .attr("class", "x axis")
        //         .call(middleXAxis)
        //         .call(g => g.select(".domain").clone()
        //             .attr("stroke-width", 3)
        //             .attr("stroke-opacity", 0.5))
        //         .call(g => g.selectAll(".tick line").clone()
        //             .attr("y1", plotHeight/2)
        //             .attr("y2", -plotHeight/2)
        //             .attr("stroke-opacity", 0.1));
        plotSvg.append("g")
                .attr("transform", `translate(${plotMargin}, ${plotHeight + marginTop})`)
                .attr("class", "x axis")
                .call(xAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", -plotHeight)
                    .attr("stroke-opacity", 0.1));
            
        plotSvg.append("g")
                .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                .attr("class", "left y axis")
                .call(tputYAxis)
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", plotWidth)
                    .attr("stroke-opacity", 0.1));
        
        plotSvg.append("g")
                .attr("transform", `translate(${plotWidth+plotMargin}, ${marginTop})`)
                .attr("class", "right y axis")
                .call(devYAxis);
    
        // Add a legend for each color.
        plotSvg.append("g")
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-15})`)
            .selectAll("text")
            .data(["Avg. Throughput", "Total Throughput", "Num. Devices"])
            .enter()
            .append('text')
            .text(d => d) 
            .attr("class", "legend")
            .attr("x", (d, i) => -(102*(3-i)+10-51))
            .attr("y", 22)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("font-size", 12);
        
        plotSvg.append("g")
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-15})`)
            .selectAll("text")
            .data(groupedData.keys())
            .enter()
            .append('text')
            .text(d => d)
            .attr("class", "legend")
            .attr("x", 2)
            .attr("y", (d, i)=> -((numAps-1-i)*13)+6.5)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("font-size", 12);

        apColor.map((color, idx) => {plotSvg.append("g")
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-15})`)
            .selectAll("rect")
            .data(color)
            .join("rect")
            .attr("x", (d, i) => -(102*(3-idx)+10))
            .attr("y", (d, i)=> -((numAps-1-i)*13))
            .attr("width", 100)
            .attr("height", 10)
            .attr("fill", (d=>d))
            .attr("stroke", "gray")
            .attr("stroke-opacity", 0.3);
        });
        
        plotSvg.append("g")
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-15})`)
            .selectAll("rect")
            .data(["Avg.", "Total", "Num. Devices"])
            .join("rect")
            .attr("x", (d, i) => -(102*(3-i)+10-51))
            .attr("y", 10)
            .attr("width", 0.01)
            .attr("height", 3)
            .attr("fill", "black")
            .attr("stroke", "black");

    });

    return (
        <svg ref={plot} width={width} height={height+props.titleHeight} />
    );
}

export default TimeTputWithFairness;