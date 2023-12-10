import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { useGraphNumber, useSelectedAP, useTimeThreshold, useBrushed } from "../../common/DataContext";

const TimeFairness = (props) => {

    const {selectedAP, setSelectedAP} = useSelectedAP();
    const {graphNumber} = useGraphNumber();
    const {timeThreshold} = useTimeThreshold(); 
    const {brushed, setBrushed} = useBrushed();
    const plot = useRef(null);

    const width = props.width;
    const height = props.height;
    // const height = plotHeight+plotMargin;
    const plotMargin = props.plotMargin;
    const plotWidth = width-2*plotMargin; 
    // const plotHeight = props.titleHeight;
    const plotHeight = height;

    useEffect(() => {
        // console.log(data);
        const plotSvg = d3.select(plot.current);
        
        let data = props.data;
        if(graphNumber!==1){
            data = data.filter(d => ((d.time >= timeThreshold[0]) && (d.time <= timeThreshold[1])));
        }

        if(brushed){
            // plotSvg.selectAll("*").remove();
            // Add a container for each series.
            const groupedData = d3.group(data, d => d.key);
            const numAps = groupedData.size;
            
            let xScale = d3.scaleLinear()
                            .domain([
                                d3.min(data, d => d.time),
                                d3.max(data, d => d.time)
                            ])
                            .range([0, plotWidth]);
            
            // Add fairness plot
            // const barWidth = (xScale(data[1].time)-xScale(data[0].time))/3*2;
            const fairnessColor = d3.scaleLinear()
                                    .domain([0, 1])
                                    .range(["red", "white"]);
                                    // .interpolate(d3.interpolateHcl);
            const fairnessHeight = (plotHeight-20)/numAps/2>15?15:(plotHeight-20)/numAps/2;
            let idx = 0;
            plotSvg.append("g")
                .attr("transform", `translate(${plotMargin}, 7)`)
                .selectAll("text")
                .data(["Fairness"])
                .join("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("font-size", 13)
                .attr("font-weight", "bold")
                .text(d => d);
            for(var key of groupedData.keys()) {
                plotSvg.append("g")
                    .attr("transform", `translate(${plotMargin}, 20)`)
                    .selectAll("rect")
                    .data(groupedData.get(key))
                    .join("rect")
                    .attr("x", d => xScale(d.time))
                    .attr("y", idx*(fairnessHeight+fairnessHeight/2))
                    .attr("class", `${key} main contents selected`)
                    .attr("width", xScale(data[1].time)-xScale(data[0].time))
                    .attr("height", fairnessHeight)
                    .attr("fill", d => fairnessColor(d.fairness))
                    .attr("stroke", d => fairnessColor(d.fairness));
                plotSvg.append("g")
                    .attr("transform", `translate(${plotMargin}, 20)`)
                    .selectAll("rect")
                    .data([1])
                    .join("rect")
                    .attr("x", d => xScale(data[0].time))
                    .attr("y", idx*(fairnessHeight+fairnessHeight/2))
                    .attr("class", `${key} main contents selected`)
                    .attr("width", plotWidth+xScale(data[1].time)-xScale(data[0].time))
                    .attr("height", fairnessHeight)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 0.5);
                plotSvg.append("g")
                    .attr("transform", `translate(${plotMargin-15}, 20)`)
                    .selectAll("text")
                    .data([key])
                    .join("text")
                    .attr("x", 0)
                    .attr("y", idx*(fairnessHeight+fairnessHeight/2)+fairnessHeight/2+1)
                    .attr("class", `${key} main contents selected`)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .attr("font-size", 10)
                    .text(d => d);  
                idx++;
            }
            setBrushed(false);
        }

        d3.selectAll('*').transition().duration(100).attr("opacity", 1);
        if(selectedAP !== -1) {
            console.log(`.AP${selectedAP+1}`);
            d3.selectAll('.main.contents')
                .classed("selected", false)
                .transition().duration(100)
                .attr("opacity", 0.2);
            d3.selectAll(`.AP${selectedAP+1}`)
                .classed("selected", true)
                .transition().duration(100)
                .attr("opacity", 1);
        }

    }, [selectedAP, graphNumber, timeThreshold]);

    return (
        <svg ref={plot} width={width} height={height} />
    );
}

export default TimeFairness;