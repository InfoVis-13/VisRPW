import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import Typography from "@mui/material/Typography";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { labels, devGroupcolor } from "../../common/Constants";

const TputNumPktWithPdr = (props) => {

    const data = props.data;
    const value = props.data.value;
    const plot = useRef(null);

    const width = props.width;
    const height = props.height;
    const plotMargin = props.plotMargin;

    const plotWidth = width-2*plotMargin;
    const plotHeight = height-2*plotMargin; 

    useEffect(() => {
        const plotSvg = d3.select(plot.current);
        console.log(value);

        const label = plotSvg.append("text")
            .attr("transform", `translate(${plotWidth/3+plotMargin+15}, ${plotHeight/2+plotMargin})`)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("fill", "#888")
            .attr("font-family", "Pretendard")
            .attr("font-size", "1.2em")
            .style("visibility", "hidden");

        // filters go in defs element
        var defs = plotSvg.append("defs");

        // create filter with id #drop-shadow
        // height=130% so that the shadow is not clipped
        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "130%");

        // SourceAlpha refers to opacity of graphic that this filter will be applied to
        // convolve that with a Gaussian with standard deviation 3 and store result
        // in blur
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 0.5)
            .attr("result", "blur");

        // translate output of Gaussian blur to the right and downwards with 2px
        // store result in offsetBlur
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 3)
            .attr("dy", 3)
            .attr("result", "offsetBlur");

        // overlay original SourceGraphic over translated blurred opacity by using
        // feMerge filter. Order of specifying inputs is important!
        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        function mouseover() {
            const className = d3.select(this).attr("class").split(" ")[0];
            const idx = parseInt(className.split("-")[1]);
            const staData = value[idx];
            console.log("idx", idx);
            console.log("staData", staData);
            label.style("visibility", null);
            let dy = -3;
            d3.selectAll(".pie.pdr").attr("opacity", 0.5);
            d3.selectAll(".pie.numPkt").attr("opacity", 0.1);
            d3.selectAll(`.idx-${idx}`)
                // .attr("stroke-width", 2)
                .attr("opacity", 1);
            d3.selectAll(`.idx-${idx}.pie.numPkt`)
                .attr("fill-opacity", 0.3)
                .style("filter", "url(#drop-shadow)");
            // d3.select(this).attr("opacity", 1)
            //     .attr("stroke", devGroupcolor(staData.status))
            //     .attr("stroke-width", 2)
            //     .attr("stroke-opacity", 1)
            //     .style("filter", "url(#drop-shadow)");
                // .style("filter", "url(#shadow)");
            Object.keys(staData).forEach((key, idx) => {
                console.log("key", key);
                if (key === "id" || key === "status") return;
                dy+=1.5;
                if (key === "throughput"){
                    console.log("throughput", staData[key]);
                    return label.append("tspan")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("dy", `${dy}em`)
                        .text(`Throughput ▹ ${staData[key].toFixed(3)} Mbps`);
                }
                else if (key === "numTxPkts"){
                    return label.append("tspan")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("dy", `${dy}em`)
                        .text(`Packets Transmitted ▹ #${staData[key]}`);
                }
                else if (key  === "pdr"){
                    return label.append("tspan")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("dy", `${dy}em`)
                        .text(`Delivery Ratio ▹ ${staData[key].toFixed(2)} %`);
                }
            });
        }

        function mouseout() {
            label.style("visibility", "hidden");
            label.selectAll("tspan").remove();
            d3.selectAll(".pie")
                .attr("stroke-width", 0.5)
                .attr("opacity", 1)
                .style("filter", null);
            d3.selectAll(".pie.numPkt")
                .attr("fill-opacity", 0.3)
                .style("filter", null);
        }

        let pie = d3.pie().value(d => d.throughput+0.3);
        const radius = plotHeight>plotWidth? plotWidth/2: plotHeight/2;
        let reverseRaiusScale = d3.scaleLinear()
            .domain([radius/2, radius])
            .range([0, d3.max(value, d => d.numTxPkts)]);
        let defautDomain = reverseRaiusScale(radius/2+radius/32)<10? 10: reverseRaiusScale(radius/2+radius/32);
        let outterRadiusScale = d3.scaleLinear()
            .domain([0, d3.max(value, d => d.numTxPkts)+defautDomain])
            .range([radius/2, radius]);
        let pktArc = d3.arc()
            .innerRadius(radius/2)
            .outerRadius(d => outterRadiusScale(d.data.numTxPkts+defautDomain))
            .cornerRadius(1)
            .padAngle(0.008);
        let pdrArc = d3.arc()
            .innerRadius(radius/2)
            // .outerRadius(d => outterRadiusScale((d.data.pdr)*(d.data.numTxPkts)/100.0))
            .outerRadius(d => outterRadiusScale((d.data.numTxPkts+defautDomain)*d.data.pdr/100))
            .cornerRadius(1)
            .padAngle(0.008);
    
        let pktpieChart = plotSvg.append("g")
            .attr("transform", `translate(${plotWidth/3+plotMargin+15}, ${plotHeight/2+plotMargin})`);
        let pdrpieChart = plotSvg.append("g")
            .attr("transform", `translate(${plotWidth/3+plotMargin+15}, ${plotHeight/2+plotMargin})`);
        // Append piechart about number of packets.
        pktpieChart.selectAll("path")
            .data(pie(value))
            .join("path")
            .attr("d", pktArc)
            .attr("fill", d => devGroupcolor(d.data.status))
            .attr("class", (d, i)=> `idx-${i} pie numPkt`)
            .attr("fill-opacity", 0.3)
            .attr("stroke", d => devGroupcolor(d.data.status))
            .attr("stroke-width", 0.5)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
        // Append piechart about packet delivery ratio.
        pdrpieChart.selectAll("path")
            .data(pie(value))
            .join("path")
            .attr("d", pdrArc)
            .attr("fill", d => devGroupcolor(d.data.status))
            .attr("class", (d, i)=> `idx-${i} pie pdr`)
            .attr("stroke", d => devGroupcolor(d.data.status))
            .attr("stroke-width", 0.5)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

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
        <React.Fragment>
            <svg ref={plot} width={width} height={height} />
            <div style={{
                position: "absolute",
                bottom: height/4,
                right: 10,
                width: plotWidth/3,
                // border: "1.5px solid #888",
                borderRadius: 3,
                padding: "10px 15px",
                // backgroundColor: "#b8b6bf",
                // color: "#494359",
            }}>
                <Stack>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                        sx={{fontSize: "1.2em"}}
                    >
                    <div>Time</div>
                    <div>{data.time} </div>
                    </Breadcrumbs>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                        sx={{fontSize: "1.2em"}}
                    >
                    <div>Number of Devices</div> 
                    <div>{data.number}</div>
                    </Breadcrumbs>
                </Stack>
            </div>
        </React.Fragment>
    );
}

export default TputNumPktWithPdr;