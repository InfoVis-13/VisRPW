import React, { useRef, useEffect, useState } from "react";

import { componentStyles, StyledTypography } from "../common/StyledComponents.js";

const TotalSummary = (props) => {

    const padding = props.padding;

    useEffect(() => {  
        
    }, []);

	return (
        <div style={{ ...componentStyles, width: props.width, height: props.height, borderRadius: 10 }}>
            <StyledTypography variant="h6" component="div" sx={{mb: 3, padding: `${padding}px`}}>
                Total Summary
            </StyledTypography>
        </div>
    )
};
export default TotalSummary;
