import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { apColor } from "../../common/Constants";
import { useSelectedAP, useTimeThreshold, useGraphNumber, useBrushed } from "../../common/DataContext";
import TimeFairness from "./TimeFairness";

const TimeTputWithFairness = (props) => {

    const data = props.data;
    const plot = useRef(null);
    const [init, setInit] = useState(false);
    const fairnessPlot = useRef(null);

    const width = props.width;
    const height = props.height;
    const plotMargin = props.plotMargin;
    const titleHeight = props.titleHeight;
    const bottomHeight = titleHeight+plotMargin;

    const plotWidth = width-2*plotMargin;
    const plotHeight = height-4*plotMargin-titleHeight; 
    const marginTop = 2*plotMargin;   

    const {selectedAP, setSelectedAP} = useSelectedAP();
    const {setTimeThreshold} = useTimeThreshold();
    const {setGraphNumber} = useGraphNumber();
    const {setBrushed} = useBrushed();

    const selectedAPHandler = (selectedAP) => {
        setSelectedAP(selectedAP);
    }

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
        }
        brushdoing = false;
    }

    function brushedEnd({selection}) {
        if(selection === null) {
            setGraphNumber(1);
        }
        else{
            setGraphNumber(2);
            setBrushed(true);
        }
    }

    useEffect(() => {
        // console.log(data);
        const plotSvg = d3.select(plot.current);
        const fairnessSvg = d3.select(fairnessPlot.current);
        const timeGap = data[1].time-data[0].time;

        // mouseover and mouseout functions
        function mouseover (e) {
            const className = e.target.className.baseVal.split(" ")[0];
            d3.selectAll('.main')
                .transition().duration(100)
                .attr("opacity", 0.2);
            d3.selectAll(`.${className}`)
                .transition().duration(100)
                .attr("opacity", 1);
        };

        function mouseout (e) {
            d3.selectAll('.main')
                .transition().duration(100)
                .attr("opacity", 0.2);
            d3.selectAll('.main.selected')
                    .transition().duration(100)
                    .attr("opacity", 1);
        };

        // click function
        function click(e) {
            console.log(e.target.className);
            const className = e.target.className.baseVal.split(" ")[0];
            d3.selectAll('.main')
                .classed("selected", false) 
                .transition().duration(100)
                .attr("opacity", 0.2);
            d3.selectAll(`.${className}`)
                .classed("selected", true)
                .transition().duration(100)
                .attr("opacity", 1);
            selectedAPHandler(parseInt(className.split("AP")[1])-1);
        };

        if(!init) {
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
            for (let [key, value] of groupedData) {
                plotSvg.append("g")
                    .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                    .selectAll("rect")
                    .data(value)
                    .join("rect")
                    .attr("class", `${key} main contents selected`)
                    .attr("x", d => xScale(d.time)-barWidth/2+(barWidth*idx))
                    // .attr("y", 1)
                    .attr("y", d=> devYScale(d.number))
                    .attr("width", barWidth)
                    // .attr("height", d=> devYScale(d.number))
                    .attr("height", d=> plotHeight-devYScale(d.number))
                    .attr("fill", apColor[2][idx])
                    .attr("stroke", apColor[2][idx])
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .on("click", click);
                idx++;
            }

            const serie = plotSvg.append("g")
                            .selectAll()
                            .data(groupedData)
                            .join("g");
            
            // Append total throughput line
            serie.append("path")
                    .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                    .attr("class", d=>`${d[0]} main contents selected`)
                    .attr("fill", "none")
                    .attr("stroke", (d, i) => apColor[1][i])
                    .attr("stroke-width", 4)
                    .attr("d", d => d3.line()
                            .x(d => xScale(d.time))
                            .y(d => tputYScale(d.total))
                            .curve(d3.curveLinear)(d[1]))
                    .attr("cursor", "pointer")
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .on("click", click);
                    
            
            // Append average throughput line
            serie.append("path")
                    .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                    .attr("fill", "none")
                    .attr("stroke", (d, i) => apColor[0][i])
                    .attr("class", d=>`${d[0]} main contents selected`)
                    .attr("stroke-width", 4)
                    .attr("d", d => d3.line()
                            .x(d => xScale(d.time))
                            .y(d => tputYScale(d.avg))
                            .curve(d3.curveLinear)(d[1]))
                    .attr("cursor", "pointer")
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .on("click", click);

                
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
                    .transition().duration(200)
                    .call(xAxis);
            plotSvg.select(".x.axis").call(g => g.select(".domain").remove())
                    .call(g => g.selectAll(".tick line").clone()
                        .attr("y2", -plotHeight)
                        .attr("stroke-opacity", 0.1));
                
            plotSvg.append("g")
                    .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                    .attr("class", "left y axis")
                    .transition().duration(200)
                    .call(tputYAxis);

            plotSvg.select(".left.y.axis")
                        .call(g => g.selectAll(".tick line").clone()
                        .attr("x2", plotWidth)
                        .attr("stroke-opacity", 0.1));
            
            plotSvg.append("g")
                    .attr("transform", `translate(${plotWidth+plotMargin}, ${marginTop})`)
                    .attr("class", "right y axis")
                    .transition().duration(200)
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
            
            // Add fairness plot
            const fairnessColor = d3.scaleLinear()
                                    .domain([0, 1])
                                    .range(["red", "white"]);
                                    // .interpolate(d3.interpolateHcl);
            const fairnessHeight = (bottomHeight-20)/numAps/2;
            idx = 0;
            fairnessSvg.append("g")
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
                fairnessSvg.append("g")
                    .attr("transform", `translate(${plotMargin}, 20)`)
                    .selectAll("rect")
                    .data(groupedData.get(key))
                    .join("rect")
                    .attr("x", d => xScale(d.time)-barWidth/2)
                    .attr("y", idx*(fairnessHeight+fairnessHeight/2))
                    .attr("class", `${key} main contents selected`)
                    .attr("width", xScale(data[1].time)-xScale(data[0].time))
                    .attr("height", fairnessHeight)
                    .attr("fill", d => fairnessColor(d.fairness))
                    .attr("stroke", d => fairnessColor(d.fairness));
                fairnessSvg.append("g")
                    .attr("transform", `translate(${plotMargin}, 20)`)
                    .selectAll("rect")
                    .data([1])
                    .join("rect")
                    .attr("x", d => xScale(data[0].time)-barWidth/2)
                    .attr("y", idx*(fairnessHeight+fairnessHeight/2))
                    .attr("class", `${key} main contents selected`)
                    .attr("width", plotWidth+xScale(data[1].time)-xScale(data[0].time))
                    .attr("height", fairnessHeight)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 0.5);
                fairnessSvg.append("g")
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
            setInit(true);
        }
        d3.selectAll('*').transition().duration(100).attr("opacity", 1);
        if(selectedAP !== -1){
            console.log(`.AP${selectedAP+1}`);
            d3.selectAll('.main')
                .classed("selected", false)
                .transition().duration(100)
                .attr("opacity", 0.2);
            d3.selectAll(`.AP${selectedAP+1}`)
                .classed("selected", true)
                .transition().duration(100)
                .attr("opacity", 1);
            d3.select(plot.current).append('g')
                .attr('class', 'brush')
                .attr('transform', `translate(${plotMargin},${marginTop})`)
                .attr("id", "brush")
                .call(brush);
        }else{
            d3.select("#brush").remove();
        }

    }, [selectedAP]);

    return (
        <React.Fragment>
            <svg ref={plot} width={width} height={height-titleHeight-plotMargin} />
            {/* <svg ref={fairnessPlot} width={width} height={bottomHeight} /> */}
            <TimeFairness 
                data={data} 
                width={width} 
                height={bottomHeight} 
                plotMargin={plotMargin} 
            />
        </React.Fragment>
    );
}

export default TimeTputWithFairness;