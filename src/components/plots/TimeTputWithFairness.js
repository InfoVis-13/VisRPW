import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const TimeTputWithFairness = (props) => {

    const data = props.data;
    const plot = useRef(null);

    const width = props.width;
    const height = props.height;
    const plotMargin = props.plotMargin;

    const plotWidth = width-2*plotMargin;
    const plotHeight = height-2*plotMargin; 

    const color = d3.schemeAccent;

    useEffect(() => {
        console.log(data);
        const plotSvg = d3.select(plot.current);
        const timeGap = data[1].time-data[0].time;

        let xScale = d3.scaleLinear()
                        .domain([
                            d3.min(data, d => d.time),
                            d3.max(data, d => d.time)+timeGap-1
                        ])
                        .range([0, plotWidth]);

        let tputYScale = d3.scaleLinear()
                        .domain([
                            0,
                            d3.max(data, d => d.total)+3
                        ])
                        .range([plotHeight, 0]);
        // let devYScale = d3.scaleLinear()
        //                 .domain([
        //                     0,
        //                     d3.max(data, d => d.number)+3
        //                 ])
        //                 .range([0, plotHeight/2]);
        let devYScale = d3.scaleLinear()
                        .domain([
                            0,
                            d3.max(data, d => d.number)+d3.max(data, d => d.total)+3
                        ])
                        .range([plotHeight, 0]);
        let xAxis = d3.axisBottom().scale(xScale);
        let middleXAxis = d3.axisBottom().scale(xScale).tickFormat((d) => '').tickSize(0);
        let tputYAxis = d3.axisLeft()
                        .scale(tputYScale)
                        .ticks(5);
        let devYAxis = d3.axisLeft()
                        .scale(devYScale)
                        .ticks(5);

        const line = d3.line()
                        .x(d => xScale(d.time))
                        .y(d => tputYScale(d.value))
                        .curve(d3.curveLinear);

        // Append number of devices line
        const barWidth = (xScale(data[1].time)-xScale(data[0].time))/2;
        plotSvg.append("g")
                .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
                .selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", d => xScale(d.time)-barWidth/2)
                // .attr("y", 1)
                .attr("y", d => devYScale(d.number))
                .attr("width", barWidth)
                // .attr("height", d=> devYScale(d.number))
                .attr("height", d=> plotHeight-devYScale(d.number))
                .attr("fill", "skyblue")
                .attr("stroke", "skyblue");
        
        // Append total throughput line
        plotSvg.append("path")
                .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 3)
                .attr("d", line(data.map(d => {
                    return {
                        "time": d.time,
                        "value": d.total
                    };
                })));
        
        // Append average throughput line
        plotSvg.append("path")
                .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", 3)
                .attr("d", line(data.map(d => {
                    return {
                        "time": d.time,
                        "value": d.avg
                    };
                })));

            
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
                .attr("transform", `translate(${plotMargin}, ${plotHeight + plotMargin})`)
                .attr("class", "x axis")
                .call(xAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", -plotHeight)
                    .attr("stroke-opacity", 0.1));
        plotSvg.selectAll(".x.axis text")
                    .attr("transform", function(d) {
                            return "translate(" + this.getBBox().height * -1 + "," + this.getBBox().height*0.5 + ")rotate(-20)";
                        });
            
        plotSvg.append("g")
                .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
                .call(tputYAxis)
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", plotWidth)
                    .attr("stroke-opacity", 0.1));
        
        plotSvg.append("g")
                .attr("transform", `translate(${plotWidth+plotMargin}, ${plotMargin})`)
                .call(devYAxis)
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", plotWidth)
                    .attr("stroke-opacity", 0.1));
            

    });

    return (
        <svg ref={plot} width={width} height={height} />
    );
}

export default TimeTputWithFairness;