import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import GraphPlot from './GraphPlot.js';
import SummaryAP from "./SummaryAP.js";
import ControlPanel from "./ControlPanel.js";
import TotalSummary from "./TotalSummary.js";
import { componentStyles, StyledTypography } from "../common/StyledComponents.js";

import configAP1 from "../data/config_ap1.json";
import configAP2 from "../data/config_ap2.json";
import throughputAP1 from "../data/throughput_ap1.json";
import throughputAP2 from "../data/throughput_ap2.json";
import pdrAP1 from "../data/pdr_ap1.json";
import pdrAP2 from "../data/pdr_ap2.json";
import numTxPktAP1 from "../data/tx_packets_ap1.json";
import numTxPktAP2 from "../data/tx_packets_ap2.json";

import { useSelectedAP, useTime, useGraphNumber } from '../common/DataContext.js';
import { preprocessData, processDevNumDevGroupData, processTimeTputWithFairnessData, processTputNumPktWithPdr } from '../common/DataProcessing.js';
import TimeNumDevGroup from "./plots/TimeNumDevGroup.js";
import TimeTputWithFairness from "./plots/TimeTputWithFairness.js";
import TputNumPktWithPdr from "./plots/TputNumPktWithPdr.js";
import TimeTputNumDev from "./plots/TimeTputNumDev.js";

const Mainplot = (props) => {

  const paddingW = window.innerWidth*0.015;
  const padding = 12;
  const entireWidth = window.innerWidth*0.97;
  const entireHeight = window.innerHeight-90;
  const leftGridInnerWidth = entireWidth*0.33-padding;
  const rightGridInnerWidth = entireWidth*0.66-2*padding; 
  const titleHeight = 35;
  const leftSubGridInnerHeight = (entireHeight-8*padding)/2;
  const plotMargin = 30;
  const mainHeight = entireHeight-2*padding;

  const [numAps , setNumAps] = useState(2);
  // const [graphNumber, setGraphNumber] = useState(2);
  const {graphNumber} = useGraphNumber();
  const {selectedAP, setSelectedAP} = useSelectedAP(); // -1: none, 0: AP1, 1: AP2
  const {time} = useTime();
  // const [selectedAP, setSelectedAP] = useState(-1);
  
  const data = [
      {
        "key" : "AP1",
        "config": configAP1,
        "throughput": preprocessData(throughputAP1),
        "pdr": preprocessData(pdrAP1),
        "numTxPkts": preprocessData(numTxPktAP1),
      },
      {
        "key" : "AP2",
        "config": configAP2,
        "throughput": preprocessData(throughputAP2),
        "pdr": preprocessData(pdrAP2),
        "numTxPkts": preprocessData(numTxPktAP2),
      }
    ];
  
  const DrawSubGraph = () => {
    if(graphNumber===1){
      return (
        <GraphPlot 
            data={processTimeTputWithFairnessData(data)} 
            width={leftGridInnerWidth} 
            height={leftSubGridInnerHeight} 
            margin={plotMargin} 
            titleHeight={titleHeight} 
            padding={padding}
            selectedAP={selectedAP}
          />
      );
    }else{
      return (
        <TimeTputNumDev
            data={processTimeTputWithFairnessData([data[selectedAP===-1?0:selectedAP]])}
            width={leftGridInnerWidth} 
            height={leftSubGridInnerHeight} 
            margin={plotMargin} 
            titleHeight={titleHeight} 
            padding={padding}
          />
      );
    }
  }
  
  const DrawMainGraph = () => {
    if(graphNumber===1){
      return (
        <TimeTputWithFairness
          data={processTimeTputWithFairnessData(data)}
          width={rightGridInnerWidth}
          height={mainHeight-titleHeight-2*padding}
          plotMargin={plotMargin}
          titleHeight={titleHeight}
        />
      );
    }else if(graphNumber===2){
      return (
        <TimeNumDevGroup 
          data={data[selectedAP===-1?0:selectedAP]} 
          width={rightGridInnerWidth}
          height={mainHeight-titleHeight-2*padding}
          plotMargin={plotMargin}
          titleHeight={titleHeight}
        />
      );
    }else{
      if (selectedAP===-1){
        setSelectedAP(0);
      }
      return (
        <TputNumPktWithPdr 
          data={processTputNumPktWithPdr(data[selectedAP===-1?0:selectedAP], time)}
          width={rightGridInnerWidth}
          height={mainHeight-titleHeight-2*padding}
          plotMargin={plotMargin}
          titleHeight={titleHeight}
        />
      );
    }
  }
 
	return (
		<Grid container sx={{width: "100%", pt: '20px', pl: `${paddingW}px`, pr: `${paddingW}px`}}>
      <Grid item xs={4}>
        <Stack spacing={`${padding}px`}>
          <Stack direction="row" spacing={`${padding}px`} useFlexGap flexWrap="wrap">
            <TotalSummary width={(leftGridInnerWidth-padding)/2} height={leftSubGridInnerHeight} margin={plotMargin} padding={padding}/>
            <SummaryAP 
              width={(leftGridInnerWidth-padding)/2} 
              height={leftSubGridInnerHeight} 
              margin={plotMargin} 
              padding={padding}
            />
            {DrawSubGraph()}
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={8} sx={{ ...componentStyles, height: mainHeight, p: `${padding}px`, position: "relative"}}>
        <ControlPanel graphNumber={graphNumber} height={titleHeight}/>
        {DrawMainGraph()}
      </Grid>
		</Grid>
	)
};
export default Mainplot;

//...componentStyles, height: props.height, borderRadius: 10, padding: `${padding}px`