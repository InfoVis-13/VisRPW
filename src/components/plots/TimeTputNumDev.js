import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { StyledTypography, componentStyles } from "../../common/StyledComponents.js";
import { apColor } from "../../common/Constants.js";
import { useSelectedAP ,useGraphNumber, useTimeThreshold, useBrushed } from "../../common/DataContext.js";


const TimeTputNumDev = (props) => {

    const data = props.data;
    const plotMargin = props.margin;
    const padding = props.padding;
    const titleHeight = props.titleHeight;
    const width = props.width-2*padding;
    const height = props.height;
    const plotWidth = width-2*plotMargin;
    const plotHeight = height-2*plotMargin;

    const plot = useRef(null);
    const {selectedAP} = useSelectedAP();
    const {timeThreshold, setTimeThreshold} = useTimeThreshold();
    const {setGraphNumber} = useGraphNumber();
    const {setBrushed} = useBrushed();

    const brush = d3.brushX()
        .extent([[0, 0], [plotWidth, plotHeight]])
        .on("start brush", Brushed)
        .on("end", brushedEnd);

    let reverseXscale = d3.scaleLinear()
    .domain([0, plotWidth])
    .range([
        d3.min(data, d => d.time),
        d3.max(data, d => d.time)+(data[1].time-data[0].time)
    ]);

    var brushdoing = false;

    function Brushed({selection}) {
        if (brushdoing === true)
            return;
        brushdoing = true;
        if (selection === null) {
            setGraphNumber(1);
            // init
            // d3.select(".plotStackGroup").style("display","none");
            // d3.select(".plotTputFair").style("display","");
        }else {
            let [x0, x1] = selection;
            let datax0 = reverseXscale(x0)
            let datax1 = reverseXscale(x1)

            if(datax1 - datax0 > 1){
                setTimeThreshold([datax0,datax1]); 
            }
            setGraphNumber(2);
            setBrushed(true);
        }
        brushdoing = false;
    }

    function brushedEnd({selection}) {
        if(selection === null) {
            setGraphNumber(1);
            setBrushed(true);
        }
        else{
            setGraphNumber(2);
            setBrushed(true);
        }
    }

    useEffect(() => {
        const plotSvg = d3.select(plot.current);
        plotSvg.selectAll("*").remove();

        const timeGap = data[1].time-data[0].time;
        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.time), d3.max(data, d => d.time)+timeGap])
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
        // Append number of devices bar
        const barWidth = (xScale(data[1].time)-xScale(data[0].time))/3*2;
        plotSvg.append("g")
            .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => xScale(d.time))
            .attr("y", d=> devYScale(d.number))
            .attr("width", barWidth)
            .attr("height", d=> plotHeight-devYScale(d.number))
            .attr("fill", apColor[2][selectedAP])
            .attr("stroke", apColor[2][selectedAP]);
        // Append total throughput line
        plotSvg.append("path")
            .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
            .attr("fill", "none")
            .attr("stroke", apColor[1][selectedAP])
            .attr("stroke-width", 4)
            .attr("d", d3.line()
                    .x(d => xScale(d.time))
                    .y(d => tputYScale(d.total))
                    .curve(d3.curveLinear)(data));
        // Append average throughput line
        plotSvg.append("path")
            .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
            .attr("fill", "none")
            .attr("stroke", apColor[0][selectedAP])
            .attr("stroke-width", 4)
            .attr("d", d3.line()
                    .x(d => xScale(d.time))
                    .y(d => tputYScale(d.avg))
                    .curve(d3.curveLinear)(data));
        // Append horizontal line
        plotSvg.append("g")
                    .attr("transform", `translate(${plotMargin}, ${plotHeight + plotMargin})`)
                    .attr("class", "x axis")
                    .transition().duration(200)
                    .call(xAxis);
        plotSvg.select(".x.axis").call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", -plotHeight)
                    .attr("stroke-opacity", 0.1));
        // Append left y axis
        plotSvg.append("g")
                .attr("transform", `translate(${plotMargin}, ${plotMargin})`)
                .attr("class", "left y axis")
                .transition().duration(200)
                .call(tputYAxis);
        plotSvg.select(".left.y.axis")
                    .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", plotWidth)
                    .attr("stroke-opacity", 0.1));
        // Append right y axis
        plotSvg.append("g")
                .attr("transform", `translate(${plotWidth+plotMargin}, ${plotMargin})`)
                .attr("class", "right y axis")
                .transition().duration(200)
                .call(devYAxis);
        // Append brush
        d3.select(plot.current).append('g')
                .attr('class', 'brush')
                .attr('transform', `translate(${plotMargin},${plotMargin})`)
                .call(brush);
        plotSvg.select(".brush").call(brush.move, [xScale(timeThreshold[0]), xScale(timeThreshold[1])]);
    }, []);

	return (
    <div style={{ ...componentStyles, padding: `${padding}px`, borderRadius: 10}}>
        <StyledTypography variant="h6" component="div" sx={{ maxHeight: titleHeight }}>
            Number of Devices
        </StyledTypography>
        <svg ref={plot} width={width} height={height}/>
    </div>
    )
};
export default TimeTputNumDev;
