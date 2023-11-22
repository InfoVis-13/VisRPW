import React, { useRef, useEffect, useState } from "react";

import Typography from '@mui/material/Typography';

const TotalSummary = (props) => {

    useEffect(() => {  
        
    }, []);

	return (
    <div
        style={{
            width:props.width, 
            height: props.height,  
            backgroundColor:"whitesmoke",
            border:"2px solid lightgray",
            borderRadius: 8,
        }}
    >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, fontSize: 18 }}>
        Conclusion
        </Typography>
    </div>
    )
};
export default TotalSummary;
