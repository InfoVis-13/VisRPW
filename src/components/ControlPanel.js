import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import DataContext from './DataContext.js';

const ControlPanel = (props) => {
    
    const dataContext = React.useContext(DataContext);
    
    const sPlot = useRef(null);  

    useEffect(() => {  
        
    }, []);

	return (
    <div style={{border: '1px solid', borderRadius: 8, width: props.width, height: props.height+2*props.margin}}>
        <p style={{marginLeft: 10}}>Control Panel</p>
        <svg ref={sPlot} width={props.width} height={props.height}/>      
    </div>
    )
};
export default ControlPanel;
