import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import DataContext from './DataContext.js';

const GraphPlot = (props) => {
    
    const dataContext = React.useContext(DataContext);
    
    const sPlot = useRef(null);  

    useEffect(() => {  
        /*console.log("graph plot")
        d3.select(sPlot.current)
        .selectAll('rect')     
        .data([1234])
        .enter()
        .append('rect')  
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", props.height)
        .attr("width", props.width)
        .attr("fill",'green')

        d3.select(sPlot.current)
        .selectAll('text')     
        .data([123])
        .enter()
        .append('text')  
        .attr("x", 20)
	    .attr("y", 20)
        .text("Graph Plot") */

        if(props.apdata == undefined) return
        
        let margin = 25;      
        let throuputwidth = props.width/2;
        let throuputX = props.width/2;

        const criteria = [25.0, 15.0, 10.0, 5.0];
        const labels = ["veryPoor", "poor", "normal", "good", "veryGood"];
        const color = ["#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00"];

        const X = d3.map(props.apdata, d => d["time"]);
        const BarY = d3.map(props.apdata, d => parseInt(d["number"]));
        var arrBar = [];
        let temp = BarY[0];
        let amount = 1;
        for(let i = 1; i < X.length; i++)
        {            
            if(temp == BarY[i])
            {
                amount++;
            }
            else{
                let colorj = criteria.length;
                for(let j = 0; j < criteria.length; j++)
                {
                    if(temp > criteria[j])
                    {
                        colorj = j;
                        break;
                    }
                }
                arrBar.push([amount, temp, colorj]);
                temp = BarY[i];
                amount = 1;
            }        
        }
        let colorj = criteria.length;
        for(let j = 0; j < criteria.length; j++)
        {
            if(temp > criteria[j])
            {
                colorj = j;
                break;
            }
        }
        arrBar.push([amount, temp, colorj]);

        console.log("Xlen : " + X.length + " width : " + throuputwidth);
        console.log(arrBar)

        let barxDomain = [0, X.length];
        let baryDomain = [0, d3.max(BarY)];

        const barxScale = d3.scaleLinear(barxDomain, [0, throuputwidth-2*margin]);
        const baryScale = d3.scaleLinear(baryDomain, [props.height-margin, margin]);
        const barxAxis = d3.axisBottom(barxScale);
        const baryAxis = d3.axisLeft(baryScale);

        let accX = margin;
        d3.select(sPlot.current)
        .selectAll('rect')
        .data(arrBar)
        .enter()
        .append('rect')  
        .attr("x", d => { 
            let curX = parseInt(accX);
            accX += barxScale(d[0])
            console.log("curX : " + curX + " next X : " + accX)
            return curX;
        })
        .attr("y", d => baryScale(d[1]))
        .attr("height", d => baryScale(0)-(baryScale(d[1])))
        .attr("width", d => barxScale(d[0]))
        .attr("fill",d=>color[d[2]])
        .attr("stroke","black")
        
        
        d3.select(sPlot.current).append("g")
        .attr("transform", `translate(${margin},${props.height-margin})`)
        .call(barxAxis);
  
        d3.select(sPlot.current).append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(baryAxis)
        
        const Y = d3.map(props.apdata, d => d["total throughput"]);
        const I = d3.range(X.length);
        let defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
        const D = d3.map(props.apdata, defined);

        const YMargin = 50;
        // Compute default domains.   
        let xDomain = [d3.min(X), d3.max(X)];     
        let yDomain = [0, d3.max(Y)+YMargin];

        // Construct scales and axes.
        const xScale = d3.scaleLinear(xDomain, [throuputX+margin, props.width-margin]);
        const yScale = d3.scaleLinear(yDomain, [props.height-margin, margin]);
        const xAxis = d3.axisBottom(xScale).ticks(throuputwidth / 80).tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale).ticks(props.height / 40);

        console.log(X);
        console.log(Y);
        console.log(I);
        console.log(D);

        let curve = d3.curveLinear;

        const line = d3.line()
            .defined(i => D[i])
            .curve(curve)
            .x(i => xScale(X[i]))
            .y(i => yScale(Y[i]));

            d3.select(sPlot.current).append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", line(I));

            d3.select(sPlot.current).append("g")
            .attr("transform", `translate(${0},${props.height-margin})`)
            .call(xAxis);
      
            d3.select(sPlot.current).append("g")
            .attr("transform", `translate(${throuputX+margin},0)`)
            .call(yAxis)

    }, []);

	return (
    <div style={{border: '1px solid', borderRadius: 8, padding: 2}}>
        <svg ref={sPlot} width={props.width} height={props.height}> 
		</svg>       
    </div>
    )

    function LineChart(data, {
        x = ([x]) => x, // given d in data, returns the (temporal) x-value
        y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
        defined, // for gaps in data
        curve = d3.curveLinear, // method of interpolation between points
        marginTop = 20, // top margin, in pixels
        marginRight = 30, // right margin, in pixels
        marginBottom = 30, // bottom margin, in pixels
        marginLeft = 40, // left margin, in pixels
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        xType = d3.scaleUtc, // the x-scale type
        xDomain, // [xmin, xmax]
        xRange = [marginLeft, width - marginRight], // [left, right]
        yType = d3.scaleLinear, // the y-scale type
        yDomain, // [ymin, ymax]
        yRange = [height - marginBottom, marginTop], // [bottom, top]
        yFormat, // a format specifier string for the y-axis
        yLabel, // a label for the y-axis
        color = "currentColor", // stroke color of line
        strokeLinecap = "round", // stroke line cap of the line
        strokeLinejoin = "round", // stroke line join of the line
        strokeWidth = 1.5, // stroke width of line, in pixels
        strokeOpacity = 1, // stroke opacity of line
      } = {}) {
        // Compute values.
        const X = d3.map(data, x);
        const Y = d3.map(data, y);
        const I = d3.range(X.length);
        if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
        const D = d3.map(data, defined);
      
        // Compute default domains.
        if (xDomain === undefined) xDomain = d3.extent(X);
        if (yDomain === undefined) yDomain = [0, d3.max(Y)];
      
        // Construct scales and axes.
        const xScale = xType(xDomain, xRange);
        const yScale = yType(yDomain, yRange);
        const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale).ticks(height / 40);
      
        // Construct a line generator.
        const line = d3.line()
            .defined(i => D[i])
            .curve(curve)
            .x(i => xScale(X[i]))
            .y(i => yScale(Y[i]));
      
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
      
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis);
      
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(yLabel));
      
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-linejoin", strokeLinejoin)
            .attr("stroke-opacity", strokeOpacity)
            .attr("d", line(I));
      
        return svg.node();
      }
};
export default GraphPlot;
