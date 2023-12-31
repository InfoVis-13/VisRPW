import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { StyledTypography, componentStyles } from "../common/StyledComponents.js";
import { apColor } from "../common/Constants.js";
import { useGraphNumber, useTimeThreshold, useBrushed } from "../common/DataContext.js";

const GraphPlot = (props) => {

    const data = props.data;
    const margin = props.margin;
    const padding = props.padding;
    const titleHeight = props.titleHeight;
    const width = props.width-2*padding;
    const height = props.height;
    const plotWidth = width-2*margin;
    const plotHeight = height-2*margin;

    const plot = useRef(null);
    const [init, setInit] = useState(false);
    const {setTimeThreshold} = useTimeThreshold();
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
            setBrushed(true);
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
        }
        brushdoing = false;
    }

    function brushedEnd({selection}) {
        if(selection === null) {
            setGraphNumber(1);
        }
        else{
            setGraphNumber(2);
        }
    }

    useEffect(() => {

        const plotSvg = d3.select(plot.current);
        if(!init){
            // Add a container for each series.
            const serie = plotSvg.append("g")
                            .selectAll()
                            .data(d3.group(data, d => d.key))
                            .join("g");
            // const x = d3.scaleUtc()
            //             .domain(d3.extent(data, d => d.time))
            //             .range([0, plotWidth]);
            const x = d3.scaleLinear()
                        .domain([
                            d3.min(data, d => d.time),
                            d3.max(data, d => d.time)
                        ])
                        .range([0, plotWidth]);
            const y = d3.scaleLinear()
                        .domain([
                            0,
                            d3.max(data, d => d.number)+3
                        ])
                        .range([plotHeight, 0]);

            let xAxis = d3.axisBottom().scale(x);
            let yAxis = d3.axisLeft()
                            .scale(y)
                            .ticks(5);

            serie.append("path")
                .attr("transform", `translate(${margin}, ${margin})`)
                .attr("fill", "none")
                .attr("stroke", (d, i) => apColor[0][i])
                .attr("stroke-width", 1.5)
                .attr("d", d=>d3.line()
                    .x(d => x(d.time))
                    .y(d => y(d.number))
                    (d[1]));

            plotSvg.append("g")
                .attr("transform", `translate(${margin}, ${plotHeight + margin})`)
                .call(xAxis)
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", -plotHeight)
                    .attr("stroke-opacity", 0.1));

            plotSvg.append("g")
                .attr("transform", `translate(${margin}, ${margin})`)
                .call(yAxis)
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", plotWidth)
                    .attr("stroke-opacity", 0.1));
            setInit(true);
        }
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
export default GraphPlot;
