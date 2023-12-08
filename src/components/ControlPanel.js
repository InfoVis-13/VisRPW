import React, { useRef, useEffect, useState } from "react";
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { componentStyles, StyledTypography } from "../common/StyledComponents.js";

const ControlPanel = (props) => {
    const padding = props.padding;
    const margin = props.margin;
    useEffect(() => {  
        
    }, []);

	return (
    <Stack direction="row" justifyContent={"end"}  spacing={1} sx={{ height:props.height }}>
        <Button variant="contained" size="small" >Throughput</Button>
        <Button variant="outlined" size="small">Fairness</Button>
        <Button variant="outlined" size="small">Number of Packets Transmitted</Button>
        <Button variant="outlined" size="small">Packet Delivery Ratio</Button>
        <Button variant="outlined" size="small" disabled>Channel Interference</Button>
        {/* <Chip label="Total Throughput" color="primary" sx={{fontSize: 14}}/>
        <Chip label="The number of Devices" color="primary" sx={{fontSize: 14}}/> */}
    </Stack>
    )
};
export default ControlPanel;
