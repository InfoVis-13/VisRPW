import React, { useRef, useEffect, useState } from "react";

import Typography from '@mui/material/Typography';

const TotalSummary = (props) => {

    useEffect(() => {  
        
    }, []);

	return (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, fontSize: 18, height: props.height }}>
         Conclusion
        </Typography>
    )
};
export default TotalSummary;
