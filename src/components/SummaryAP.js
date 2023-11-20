import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import DataContext from './DataContext.js';

import config from '../data/config.json';

const SummaryAP = (props) => {
    
    const dataContext = React.useContext(DataContext);
    
    const sPlot = useRef(null);  

    useEffect(() => {  
        
        /*d3.select(sPlot.current)
        .selectAll('rect')     
        .data([1234])
        .enter()
        .append('rect')  
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", props.height)
        .attr("width", props.width)
        .attr("fill",'yellow')

        d3.select(sPlot.current)
        .selectAll('text')     
        .data([123])
        .enter()
        .append('text')  
        .attr("x", 20)
	    .attr("y", 20)
        .text("summary AP")*/

        console.log( config );

        d3.select(sPlot.current)
        .selectAll('text')
        .data(Object.keys(config))
        .enter()
        .append('text')
        .attr("x",20)
        .attr("y",(d,i)=>{console.log(d,i)
            return 20*(i+1)})
        .text((d,i)=>d+" - "+config["AP"+(i+1)]["band"])

    }, []);

	return (
    <div style={{border: '1px solid', borderRadius: 8}}>
        <svg ref={sPlot} width={props.width} height={props.height}> 
		</svg>       
    </div>
    )
};
export default SummaryAP;
