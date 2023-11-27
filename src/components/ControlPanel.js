import React, { useRef, useEffect, useState } from "react";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { componentStyles } from "../common/StyledComponents.js";

const ControlPanel = (props) => {
    const padding = props.padding;

    useEffect(() => {  
        
    }, []);

	return (
    <div style={{...componentStyles, height: props.height, borderRadius: 10, padding: `${padding}px`}}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, fontSize: 20 }}>
            Row
        </Typography>
        <Stack direction="column" spacing={1} sx={{ pl:3, pr:3, pt:1 }}>
            <Chip label="Time" color="primary" sx={{fontSize: 18}}/>
        </Stack>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:2, fontSize: 20 }}>
            Column
        </Typography>
        <Stack direction="column" spacing={1} sx={{ pl:3, pr:3, pt:1 }}>
            <Chip label="Total Throughput" color="primary" sx={{fontSize: 18}}/>
            <Chip label="The number of Devices" color="primary" sx={{fontSize: 18}}/>
        </Stack>
    </div>
    )
};
export default ControlPanel;
