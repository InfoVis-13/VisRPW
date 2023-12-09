import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const TputNumPktWithPdr = (props) => {

    const data = props.data.value;
    const plot = useRef(null);

    const width = props.width;
    const height = props.height;
    const plotMargin = props.plotMargin;

    const plotWidth = width-2*plotMargin;
    const plotHeight = height-2*plotMargin; 

    useEffect(() => {
        const plotSvg = d3.select(plot.current);
        let statsData = [];
    });

    return (
        <svg ref={plot} width={width} height={height} />
    );
}

export default TputNumPktWithPdr;