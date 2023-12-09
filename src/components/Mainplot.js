import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import GraphPlot from './GraphPlot.js';
import SummaryAP from "./SummaryAP.js";
import ControlPanel from "./ControlPanel.js";
import TotalSummary from "./TotalSummary.js";
import { componentStyles, StyledTypography } from "../common/StyledComponents.js";

import apdata from "../data/ap1_dummy.json";
import configAP1 from "../data/config_ap1.json";
import configAP2 from "../data/config_ap2.json";
import throughputAP1 from "../data/throughput_ap1.json";
import throughputAP2 from "../data/throughput_ap2.json";
import pdrAP1 from "../data/pdr_ap1.json";
import pdrAP2 from "../data/pdr_ap2.json";
import numTxPktAP1 from "../data/tx_packets_ap1.json";
import numTxPktAP2 from "../data/tx_packets_ap2.json";

import DataContext from './DataContext.js';
import { preprocessData, processDevNumDevGroupData, processTimeTputWithFairnessData } from '../common/DataProcessing.js';
import TimeNumDevGroup from "./plots/TimeNumDevGroup.js";
import TimeTputWithFairness from "./plots/TimeTputWithFairness.js";

const Mainplot = (props) => {
  const dataContext = React.useContext(DataContext);

  const paddingW = window.innerWidth*0.015;
  const padding = 15;
  const entireWidth = window.innerWidth*0.97;
  const entireHeight = window.innerHeight-90;
  const leftGridInnerWidth = entireWidth*0.33-2*padding;
  const rightGridInnerWidth = entireWidth*0.66-2*padding; 
  const titleHeight = 35;
  const leftSubGridInnerHeight = (entireHeight-7.5*padding)/2;
  const plotMargin = 30;
  const mainHeight = entireHeight-2*padding;

  const [numAps , setNumAps] = useState(2);
  const data = [
      {
        "key" : "AP1",
        "config": configAP1,
        "throughput": preprocessData(throughputAP1),
        "pdr": preprocessData(pdrAP1),
        "txPackets": preprocessData(numTxPktAP1),
      },
      {
        "key" : "AP2",
        "config": configAP2,
        "throughput": preprocessData(throughputAP2),
        "pdr": preprocessData(pdrAP2),
        "txPackets": preprocessData(numTxPktAP2),
      }
    ];
  console.log(data);
  console.log(parseFloat("-1.000"));

 
	return (
		<Grid container sx={{width: "100%", pt: '20px', pl: `${paddingW}px`, pr: `${paddingW}px`}}>
      <Grid item xs={4}>
        <Stack spacing={`${padding}px`}>
          <Stack direction="row" spacing={`${padding}px`} useFlexGap flexWrap="wrap">
            <TotalSummary width={leftGridInnerWidth/2} height={leftSubGridInnerHeight} margin={plotMargin} padding={padding}/>
            <SummaryAP width={leftGridInnerWidth/2} height={leftSubGridInnerHeight} margin={plotMargin} padding={padding}/>
            <GraphPlot data={processTimeTputWithFairnessData(data)} width={leftGridInnerWidth} height={leftSubGridInnerHeight} margin={plotMargin} titleHeight={titleHeight}/>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={8} sx={{ ...componentStyles, height: mainHeight, p: `${padding}px`}}>
        <ControlPanel height={titleHeight}/>
        {/* <StyledTypography variant="h6" component="div" sx={{ flexGrow: 1, pl:1, mt:1, maxHeight: titleHeight }}>
          Number of Devices
        </StyledTypography> */}
        <div class="plotStackGroup" style={{display:"none"}}>
        { <TimeNumDevGroup
          data={processDevNumDevGroupData(data[0]["throughput"])}
          width={rightGridInnerWidth}
          height={mainHeight-titleHeight-2*padding}
          plotMargin={plotMargin}
          titleHeight={titleHeight}
        /> }
        </div>
        <div class="plotTputFair" style={{display:""}}>
        <TimeTputWithFairness
          
          data={processTimeTputWithFairnessData(data)}
          width={rightGridInnerWidth}
          height={mainHeight-titleHeight-2*padding}
          plotMargin={plotMargin}
          titleHeight={titleHeight}
        />
        </div>
      </Grid>
		</Grid>
	)
};
export default Mainplot;

//...componentStyles, height: props.height, borderRadius: 10, padding: `${padding}px`