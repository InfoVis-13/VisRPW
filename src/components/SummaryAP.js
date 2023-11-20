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

        const arrtext = [];
        let confkeys = Object.keys(config)
        for (let i = 0; i < confkeys.length; i++)
        {
               arrtext.push(confkeys[i])
               let contents = Object.keys(config[confkeys[i]]);
               console.log(contents);
               for(let j = 0; j < contents.length; j++)
               {
                    arrtext.push(" ㄴ " + contents[j] + " : " + config[confkeys[i]][contents[j]]);
               }
        }

        var textheight = 0;

        d3.select(sPlot.current)
        .selectAll('text')
        .data(arrtext)
        .enter()
        .append('text')
        .attr("x",20)
        .attr("y",(d,i)=>{textheight += 20; return textheight;})
        .text((d,i)=>d)
        //.style("font-size", "10px")

    }, []);

	return (
    <div>
        <svg ref={sPlot} width={props.width} height={props.height}> 
		</svg>       
    </div>
    )
};
export default SummaryAP;
