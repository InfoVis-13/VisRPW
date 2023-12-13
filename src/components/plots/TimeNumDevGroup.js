import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { criteria, labels, devGroupcolor } from "../../common/Constants";
import { useSelectedAP, useTimeThreshold, useTime, useGraphNumber } from "../../common/DataContext";
import { processDevNumDevGroupData, processTimeTputWithFairnessData } from "../../common/DataProcessing";
import TimeFairness from "./TimeFairness";

const TimeNumDevGroup = (props) => {
    
    const plot = useRef(null);
    const width = props.width;
    const height = props.height;
    const plotMargin = props.plotMargin;
    const titleHeight = props.titleHeight;
    const bottomHeight = titleHeight+plotMargin-15;

    const plotWidth = width-2*plotMargin;
    // const plotHeight = height-3*plotMargin-titleHeight; 

    const plotHeight = height-4*plotMargin-titleHeight+15; 
    const marginTop = 2*plotMargin;   
    // const marginTop = 2*plotMargin+props.titleHeight;   

    // const {selectedAP} = useSelectedAP();
    const {timeThreshold} = useTimeThreshold();
    const {setTime} = useTime();
    const {setGraphNumber} = useGraphNumber();

    useEffect(() => {
        const plotSvg = d3.select(plot.current);
        plotSvg.selectAll("*").remove();

        console.log("AP", props.data["key"]);
        console.log("timeThreshold", timeThreshold);
        
        // statsData.filter(d => ((d.time >= timethreshold[0]) && (d.time <= timethreshold[1])));
        // console.log(statsData);

        // plotSvg.selectAll(".mainrect").remove();
        let devGroupdata = processDevNumDevGroupData(props.data["throughput"]);
        let statsData = processTimeTputWithFairnessData([props.data]);
        devGroupdata = devGroupdata.filter(d => ((d.time >= timeThreshold[0]) && (d.time <= timeThreshold[1])));
        statsData = statsData.filter(d => ((d.time >= timeThreshold[0]) && (d.time <= timeThreshold[1])));
        
        // Determine the series that need to be stacked.
        const series = d3.stack()
            .keys(d3.union(devGroupdata.map(d => d.label))) // distinct series keys, in input order
            .value(([, D], key) => D.get(key).count) // get value for each series key and stack
        (d3.index(devGroupdata, d => d.time, d => d.label)); // group by stack then series key
         //console.log("series", series);
        
        // Prepare the scales for positional and color encodings.
        const x = d3.scaleBand()
            .domain(d3.groupSort(devGroupdata, D => d3.sum(D, d => d.time), d => d.time))
            // .domain(d3.groupSort(statsData, d => d.time))
            .range([0, plotWidth])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1])*2)])
            .rangeRound([plotHeight, 0]);

        const xAxisScale = d3.scaleLinear()
            .domain([ d3.min(devGroupdata, d => d.time), d3.max(devGroupdata, d => d.time) ])
            .range([0, plotWidth]);
        let xAxis = d3.axisBottom().scale(xAxisScale).ticks(30).tickSizeOuter(0);
        let yAxis = d3.axisRight().scale(y).ticks(plotHeight / 80);

        // plotSvg.select(".x.axis").remove();
        // plotSvg.select(".y.axis").remove();
        // Append the horizontal axis atop the area.
        plotSvg.append("g").attr("class", "x axis")
            .attr("transform", `translate(${plotMargin}, ${plotHeight + marginTop})`)
            // .transition().duration(200)
            .call(xAxis);
        
        // Add the y-axis, remove the domain line, add grid lines and a label.
        plotSvg.append("g").attr("class", "right y axis")
            .attr("transform", `translate(${plotWidth+plotMargin}, ${marginTop})`)
            // .transition().duration(200)
            .call(yAxis);

        plotSvg.selectAll(".right.y.axis")
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", -plotWidth)
                .attr("stroke-opacity", 0.1));
        
        // Rotate the x-axis labels.
        plotSvg.selectAll(".x.axis text")
        .attr("transform", function(d) {
                return "translate(" + this.getBBox().height * -1 + "," + this.getBBox().height*0.5 + ")rotate(-20)";
            });

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
            // .transition().duration(200)
            .attr("class", d=>`time-${d.data[0]} mainrect`)
            // .attr("id",function(d, i) { 
            //     console.log("id", d.data[0]);
            //     // return `time-${d.data[0]}`;
            //     return "rect" + i; 
            // })
            .attr("x", d => x(d.data[0]))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("stroke", "grey")
            .attr("stroke-opacity", 0.2)
            .on('mouseover', function() {
                const className = d3.select(this).attr("class");
                // console.log("className", className);
                const id = className.split(" ")[0];
                d3.selectAll(".mainrect").attr("opacity", 0.5);
                d3.selectAll("."+id).attr("opacity", 1);
            })
            .on("mouseout", function(){
                d3.selectAll(".mainrect").attr("opacity", 1);
            })
            .on("click", function(){
                const className = d3.select(this).attr("class");
                const id = className.split(" ")[0];
                var time = id.split("-")[1];
                setTime(parseInt(time));
                setGraphNumber(3);
            })
        
        // Add a legend for each color.
        plotSvg.append("g")
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-10})`)
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
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-10})`)
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
            .attr("transform", `translate(${plotWidth+plotMargin/2}, ${plotMargin-10})`)
            .selectAll("rect")
            .data(labels)
            .join("rect")
            .attr("x", (d, i) => -(52*(i+1)+10-26))
            .attr("y", 10)
            .attr("width", 0.01)
            .attr("height", 3)
            .attr("fill", "black")
            .attr("stroke", "black");

        // append total throghput line
        let tputYScale = d3.scaleLinear()
                            .domain([
                                0,
                                d3.max(statsData, d => d.total)+5
                            ])
                            .range([plotHeight, 0]);
        let tputYAxis = d3.axisLeft()
                            .scale(tputYScale)
                            .ticks(10);
        // Append total throughput line
        plotSvg.append("path")
                .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                // .attr("class", d=>`${d[0]} main contents selected`)
                .attr("fill", "none")
                .attr("stroke", "#54565c")
                .attr("stroke-width", 5)
                .attr("d", d3.line()
                        .x(d => xAxisScale(d.time))
                        .y(d => tputYScale(d.total))
                        .curve(d3.curveLinear)(statsData));

        // Append average throughput line
        plotSvg.append("path")
                .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                .attr("fill", "none")
                .attr("stroke", "#54565c")
                // .attr("class", d=>`${d[0]} main contents selected`)
                .attr("stroke-width",5)
                .attr("d", d3.line()
                        .x(d => xAxisScale(d.time))
                        .y(d => tputYScale(d.avg))
                        .curve(d3.curveLinear)(statsData));
        
        plotSvg.append("g")
                .attr("transform", `translate(${plotMargin}, ${marginTop})`)
                .attr("class", "left y axis")
                // .transition().duration(200)
                .call(tputYAxis);
        plotSvg.selectAll(".left.y.axis")
                .call(g => g.select(".domain").remove());
                plotSvg.selectAll(".left.y.axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -plotHeight/2+plotMargin*2)
                .attr("y", 15)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .attr("font-family", "Pretendard")
                .attr("font-size", 12)
                .text("Throughput (Mbps)");
        
        plotSvg.selectAll(".right.y.axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -plotHeight/2+plotMargin*2)
                .attr("y", -5)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .attr("font-family", "Pretendard")
                .attr("font-size", 12)
                .text("Number of Devices");

        
    },[timeThreshold]);

    return (
        <React.Fragment>
            <svg ref={plot} width={width} height={height-titleHeight-plotMargin+15}/> 
            <TimeFairness 
                data={processTimeTputWithFairnessData([props.data])} 
                width={width} 
                height={bottomHeight} 
                plotMargin={plotMargin} 
            />
        </React.Fragment>
    );
};

export default TimeNumDevGroup;