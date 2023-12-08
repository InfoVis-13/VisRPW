import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { criteria, labels, devGroupcolor } from "../../common/Constants";

const TimeNumDevGroup = (props) => {
    const data = props.data;
    const plot = useRef(null);

    const width = props.width;
    const height = props.height;
    const plotMargin = props.plotMargin;
    const titleHeight = props.titleHeight;

    const plotWidth = width-2*plotMargin;
    const plotHeight = height-3*plotMargin-titleHeight; 
    const marginTop = 2*plotMargin+props.titleHeight;   

    useEffect(() => {
        const plotSvg = d3.select(plot.current);
            
        // statsData.filter(d => ((d.time >= timethreshold[0]) && (d.time <= timethreshold[1])));
        // console.log(statsData);

        plotSvg.selectAll(".mainrect").remove();

        // Determine the series that need to be stacked.
        const series = d3.stack()
            .keys(d3.union(data.map(d => d.label))) // distinct series keys, in input order
            .value(([, D], key) => D.get(key).count) // get value for each series key and stack
        (d3.index(data, d => d.time, d => d.label)); // group by stack then series key
        // console.log("series", series);

        // Prepare the scales for positional and color encodings.
        const x = d3.scaleBand()
            .domain(d3.groupSort(data, D => d3.sum(D, d => d.time), d => d.time))
            // .domain(d3.groupSort(statsData, d => d.time))
            .range([0, plotWidth])
            .padding(0.1);

        // const x = d3.scaleBand()
        //   .domain([
        //     d3.min(statsData, d => d.time),
        //     d3.max(statsData, d => d.time)+timeGap
        //   ])
        //   .range([0, plotWidth])
        //   .padding(0.1);

        // const x = d3.scaleUtc()
        //   .domain([
        //         d3.min(statsData, d => d.time),
        //         d3.max(statsData, d => d.time)+timeGap
        //   ])
        //   // .domain(d3.extent(statsData, d => d.time))
        //   .range([0, plotWidth]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1])+1)])
            .rangeRound([plotHeight, 0]);

        // const color = d3.scaleOrdinal()
        //   .domain(series.map(d => d.key))
        //   .range(labelColor);
        //   // .range(d3.schemeTableau10);

        // const color = d3.scaleOrdinal()
        //   .domain(series.map(d => d.key))
        //   .range(d3.schemeSpectral[series.length])
        //   .unknown("#ccc");
        
        // console.log("color", color);

        const xAxisScale = d3.scaleLinear()
            .domain([ d3.min(data, d => d.time), d3.max(data, d => d.time) ])
            .range([0, plotWidth]);
        let xAxis = d3.axisBottom().scale(xAxisScale).ticks(30).tickSizeOuter(0);
        let yAxis = d3.axisLeft().scale(y).ticks(plotHeight / 80);

        // Append the horizontal axis atop the area.
        plotSvg.append("g").attr("class", "x axis timenumdevgroup")
            .attr("transform", `translate(${plotMargin}, ${plotHeight + marginTop})`)
            .call(xAxis);
        
        // Add the y-axis, remove the domain line, add grid lines and a label.
        plotSvg.append("g").attr("class", "y axis").call(yAxis)
            .attr("transform", `translate(${plotMargin}, ${marginTop})`)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", plotWidth)
                .attr("stroke-opacity", 0.1));
        
        // Rotate the x-axis labels.
        plotSvg.selectAll(".x.axis.timenumdevgroup text")
        .attr("transform", function(d) {
                return "translate(" + this.getBBox().height * -1 + "," + this.getBBox().height*0.5 + ")rotate(-20)";
            });

        // Construct an area shape.
        // const area = d3.area()
        //   .x(d => x(d.data[0]))
        //   .y0(d => y(d[0]))
        //   .y1(d => y(d[1]));

        // Append a path for each series.
        // mainSvg.append("g")
        // .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
        // .selectAll()
        // .data(series)
        // .join("path")
        //   .attr("fill", d => color(d.key))
        //   .attr("d", area)
        // .append("title")
        //   .text(d => d.key);

        // Append a group for each series, and a rect for each element in the series.
        plotSvg.append("g")
            .attr("transform", `translate(${plotMargin}, ${marginTop})`)
            .selectAll()
            .data(series)
            .join("g")
            .attr("fill", d => devGroupcolor(d.key))
            .selectAll("rect")
            .data(D => D.map(d => (d.key = D.key, d)))
            .join("rect")
            .attr("class","mainrect")
            .attr("x", d => x(d.data[0]))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("stroke", "gray")
            .attr("stroke-opacity", 0.2);
        
        // Add a legend for each color.
        plotSvg.append("g")
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-15})`)
            .selectAll("text")
            .data(["Device Status", ...labels])
            .enter()
            .append('text')
            .text(d => d) 
            .attr("class", "legend")
            .attr("x", (d, i) => {
                if(i === 0) return -45;
                return -(52*(i-1)+10+26);
            })
            .attr("y", (d, i) => (i===0)?-8:22)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("font-size", 12);

        plotSvg.append("g")
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-15})`)
            .selectAll("rect")
            .data(labels)
            .join("rect")
            .attr("x", (d, i) => -(52*(i+1)+10))
            // .attr("y", 20)
            .attr("width", 50)
            .attr("height", 10)
            .attr("fill", (d,i)=>devGroupcolor(d))
            .attr("stroke", "gray")
            .attr("stroke-opacity", 0.3);
        
        plotSvg.append("g")
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-15})`)
            .selectAll("rect")
            .data(labels)
            .join("rect")
            .attr("x", (d, i) => -(52*(i+1)+10-26))
            .attr("y", 10)
            .attr("width", 0.01)
            .attr("height", 3)
            .attr("fill", "black")
            .attr("stroke", "black");
        
    });

    return (
        <svg ref={plot} width={width} height={height}/> 
    );
};

export default TimeNumDevGroup;