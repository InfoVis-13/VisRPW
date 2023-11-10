import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import DataContext from './DataContext.js';

const GraphPlot = (props) => {
    
    const dataContext = React.useContext(DataContext);
    
    const sPlot = useRef(null);  

    useEffect(() => {  
        console.log("graph plot")
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
        .text("Graph Plot")
    }, []);

	return (
    <div>
        <svg ref={sPlot} width={props.width} height={props.height}> 
		</svg>       
    </div>
    )
};
export default GraphPlot;
