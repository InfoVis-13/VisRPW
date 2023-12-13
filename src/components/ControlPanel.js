import React, { useRef, useEffect, useState } from "react";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const ControlPanel = (props) => {
    const graphNumber = props.graphNumber;
    // const graphNumber = useGraphNumber();

    useEffect(() => {  
        
    }, []);

	return (
    <Stack direction="row" justifyContent={"start"}  spacing={1} sx={{ height:props.height }}>
        <Chip label="Throughput" color="primary" sx={{fontSize: 14}}/>
        <Chip label="Fairness" color="primary" variant={graphNumber===3?"outlined":"filled"} sx={{fontSize: 14}}/>
        <Chip label="Number of Packets Transmitted" color="primary" variant={graphNumber===3?"filed":"outlined"} sx={{fontSize: 14}}/>
        <Chip label="Packet Delivery Ratio" color="primary" variant={graphNumber===3?"filed":"outlined"} sx={{fontSize: 14}}/>
    </Stack>
    )
};
export default ControlPanel;
