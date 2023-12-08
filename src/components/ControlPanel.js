import React, { useRef, useEffect, useState } from "react";
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { componentStyles, StyledTypography } from "../common/StyledComponents.js";

const ControlPanel = (props) => {
    const graphNumber = props.graphNumber;

    useEffect(() => {  
        
    }, []);

	return (
    <Stack direction="row" justifyContent={"start"}  spacing={1} sx={{ height:props.height }}>
        {/* <Button variant="contained" size="small" >Throughput</Button>
        <Button variant="outlined" size="small">Fairness</Button>
        <Button variant="outlined" size="small" disabled>Number of Packets Transmitted</Button>
        <Button variant="outlined" size="small" disabled>Packet Delivery Ratio</Button> */}
        <Chip label="Throughput" color="primary" sx={{fontSize: 14}}/>
        {/* <Chip label="The number of Devices" color="primary"/> */}
        <Chip label="Fairness" color="primary" variant={graphNumber===1?"filed":"outlined"} sx={{fontSize: 14}}/>
        <Chip label="Number of Packets Transmitted" color="primary" variant={graphNumber===3?"filed":"outlined"} sx={{fontSize: 14}}/>
        <Chip label="Packet Delivery Ratio" color="primary" variant={graphNumber===3?"filed":"outlined"} sx={{fontSize: 14}}/>
    </Stack>
    )
};
export default ControlPanel;
