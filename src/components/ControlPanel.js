import React, { useRef, useEffect, useState } from "react";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import DataContext from './DataContext.js';

const ControlPanel = (props) => {

    useEffect(() => {  
        
    }, []);

	return (
    <div style={{
        border: '2px solid lightgray', 
        borderRadius: 8, 
        backgroundColor: 'white',
        width: props.width, 
        height: props.height+2*props.margin
    }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, fontSize: 18 }}>
            Row
        </Typography>
        <Stack direction="column" spacing={1} sx={{ pl:3, pr:3, pt:1 }}>
            <Chip label="Time" color="primary"/>
        </Stack>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:2, fontSize: 18 }}>
            Column
        </Typography>
        <Stack direction="column" spacing={1} sx={{ pl:3, pr:3, pt:1 }}>
            <Chip label="Total Throughput" color="primary"/>
            <Chip label="The number of Devices" color="primary"/>
        </Stack>
    </div>
    )
};
export default ControlPanel;
