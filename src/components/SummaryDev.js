import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import DataContext from './DataContext.js';

const SummaryDev = (props) => {
    
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
        .attr("fill",'orange')

        d3.select(sPlot.current)
        .selectAll('text')     
        .data([123])
        .enter()
        .append('text')  
        .attr("x", 20)
	    .attr("y", 20)
        .text("summary Dev")*/

        const count = [220, 6, 3];

        d3.select(sPlot.current)
        .selectAll('rect')     
        .data(['green','orange','red'])
        .enter()
        .append('rect')  
        .attr("x", 2)
        .attr("y",(d,i)=> 20*i+7)
        .attr("height", 17)
        .attr("width", 17)
        .attr("fill",d=>d)

        d3.select(sPlot.current)
        .selectAll('.text')
        .data(['good','warning','bad'])
        .enter()
        .append('text')
        .attr("x",25)
        .attr("y",(d,i)=>20*(i+1)+1)
        .text((d,i)=>" - "+count[i])

        var  badips = ['3','4','5'];

        d3.select(sPlot.current)
        .selectAll('.text')
        .data(badips)
        .enter()
        .append('text')
        .attr("x",30)
        .attr("y",(d,i)=>20*(i)+85)
        .text((d,i)=> (" ㄴ T"+d))

    }, []);

	return (
    <div>
        <svg ref={sPlot} width={props.width} height={props.height}> 
		</svg>       
    </div>
    )
};
export default SummaryDev;
