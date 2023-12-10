import React, { useEffect } from "react";
import * as d3 from "d3";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
// import HelpIcon from '@mui/icons-material/Help';
// import InfoIcon from '@mui/icons-material/Info';

import { processTimeTputWithFairnessData } from "../common/DataProcessing.js";
import { criteria } from "../common/Constants.js";
import { componentStyles, StyledAccordion, StyledAccordionSummary, StyledTypography } from "../common/StyledComponents.js";
import { useSelectedAP, useGraphNumber } from "../common/DataContext.js";
import { Html } from "@mui/icons-material";


const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            // backgroundColor: '#f5f5f9',
            // color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            // border: '1px solid #dadde9',
            padding: '10px 13px 3px 13px',
        },
    }));

const TotalSummary = (props) => {

    const padding = props.padding;
    const {selectedAP, setSelectedAP} = useSelectedAP();
    const {graphNumber, setGraphNumber} = useGraphNumber();

    const problems = {
        UNFAIRNESS: "There is edge devices that have low throughput unlike others.",
        HIGH_LATENCY: "Some devices suffer from have high latency.",
        HIGH_LOSS: "Some devices suffer from have high packet loss.",
        HIGH_TRAFFIC: "There is too much traffic for the network to handle.",
        POOR_DEVS: "Some devices have poor service condition.",
    };
    Object.freeze(problems);

    const causes ={
        NOT_USE: "Some devices are not used.",
        HIGH_INTERFERNECE: "Some devices suffer from have high interference.",
        NLOS_ENV: "There are obtacles to prevent reception near some devices.",
        INTERFERNCE_OVERALL: "There is too much interference for the network to handle.",
        NLOS_ENV_OVERALL: "There are obtacles to prevent transmssion near AP.",
    };
    Object.freeze(causes);

    const solutions = {
        MOVE_LOC: "Move the AP to a better location.",
        MOVE_LOC_TO_EDGE: "Move the AP to the edge of the network.",
        MOVE_LOC_TO_NLOS: "Move the AP to a location near NLOS environments.",
        REMOVE_INTERFERENCE: "Remove interference.",
        ADDITIONAL_AP: "Add additional AP.",
        ADDITIONAL_AP_NLOS: "Add additional AP near NLOS environments.",
        ADDITIONAL_CHANNEL: "Add additional channel.",
        EXTENT_BANDWIDTH: "Expand additional bandwidth.",
        SET_QOS: "Set QoS requirements.",
    };
    Object.freeze(solutions);

    const [summary, setSummary] = React.useState([]);

    const handleChange = (panel) => (event, isExpanded) => {
        console.log(panel);
        setSelectedAP(isExpanded ? panel : -1);
        if(graphNumber!==1){
            console.log("remove");
            d3.selectAll(".selection").remove();
            d3.selectAll(".handle").remove();   
            setGraphNumber(1);
        }
    };

    const DisplayResults = (i, result) => {
        return (
            <StyledAccordion
                sx={{ boxShadow:"none" }}
                expanded={selectedAP===i}
                onChange={handleChange(i)}
            >
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`AP${i+1}-summary`}
                    id={`AP${i+1}}-summary`}
                >
                    <StyledTypography variant="subtitle1" sx={{
                        "font-weight":(selectedAP===i)?'600':'400',
                        "color":(selectedAP===i || selectedAP===-1)?'black':'grey.500',
                    }}
                    >
                        AP {i+1}
                    </StyledTypography>
                </StyledAccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: "#ebebeb"}}>
                    {result.problems.map(problem => {
                        return (
                            <HtmlTooltip title={
                                <React.Fragment>
                                    {problem.causes.length > 0?
                                    <React.Fragment>
                                    <StyledTypography color="inherit">The causes may be as follows.</StyledTypography>
                                    <ul style={{paddingLeft: 15}}>
                                        {problem.causes.map(cause => {
                                            return (
                                                <li>
                                                    <StyledTypography color="inherit">{cause}</StyledTypography>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    </React.Fragment>:null}
                                    <StyledTypography color="inherit">The solutions may be as follows.</StyledTypography>
                                    <ul style={{paddingLeft: 15, paddingBottom:0}}>
                                        {problem.solutions.map(solution => {
                                            return (
                                                <li>
                                                    <StyledTypography color="inherit">{solution}</StyledTypography>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </React.Fragment>
                            } arrow placement="right">
                            <Stack direction="row" spacing={1} sx={{mb: 0.5}}>
                                <CheckIcon fontSize="1vw"/>
                                <StyledTypography sx={{cursor:"help"}}>
                                    {problem.name}
                                    {/* <InfoIcon viewBox="0 -4.5 26 26" fontSize="1vw" sx={{color: "grey.500", ml: 0.1, mb: '-1px'}}/> */}
                                </StyledTypography>
                            </Stack>
                            </HtmlTooltip>
                        );
                    })}
                </AccordionDetails>
            </StyledAccordion>
        );
    }

    useEffect(() => {  
        let results = [];
        for(let idx in props.data){
            let apData = props.data[idx];
            console.log(apData.key);
            results.push({
                "key": props.data[idx].key,
                "problems": []
            });
            let problemOn = new Array(5).fill(false);
            let unfairness = false;
            let unfairnessStart = -1;
            let statsData = processTimeTputWithFairnessData([apData]);
            for(let i in statsData){
                let stat = statsData[i];
                if(stat["fairness"] < 0.5){
                    unfairness = true;
                    if(unfairnessStart === -1) unfairnessStart = stat["time"];
                    if(stat["time"]-unfairnessStart > 5){
                        if(!problemOn[0] && !problemOn[1]){
                            results[idx].problems.push({
                                "name": problems.UNFAIRNESS,
                                "causes": [],
                                "solutions": [solutions.ADDITIONAL_AP, solutions.MOVE_LOC_TO_EDGE]
                            });
                            results[idx].problems.push({
                                "name": problems.HIGH_LATENCY,
                                "causes": [],
                                "solutions": [solutions.ADDITIONAL_AP, solutions.MOVE_LOC_TO_EDGE]
                            });
                        }
                        problemOn[0] = true;
                        problemOn[1] = true;
                    }
                }
                else { 
                    unfairness = false; 
                    unfairnessStart = -1; 
                    if(stat["avg"] <= criteria[2] && apData["pdr"][i]["total"] >= 90) {
                        if(!problemOn[3]){
                            results[idx].problems.push({
                                "name": problems.HIGH_TRAFFIC,
                                "causes": [],
                                "solutions": [solutions.ADDITIONAL_AP, solutions.EXTENT_BANDWIDTH, solutions.SET_QOS, solutions.ADDITIONAL_CHANNEL]
                            });
                        }
                        problemOn[3] = true;
                    }
                }
                // console.log(i, stat["time"]);
                // console.log(apData["throughput"]);
                let cnt=0;
                for (let j=0; ;j++){
                    if (apData["throughput"][i][`sta${j+1}`] === -1.0) continue;
                    if (apData["throughput"][i][`sta${j+1}`] <= criteria[2]) {
                        // if(!problemOn[4]){
                        //     results[idx].problems.push(problems.POOR_DEVS);
                        // }
                        // problemOn[4] = true;
                        if(i+1 < statsData.length && apData["pdr"][i][`sta${j+1}`] <= 50 && apData["pdr"][i+1][`sta${j+1}`] <= 50) {
                            if(!problemOn[2]){
                                let item = {
                                    "name": problems.HIGH_LOSS,
                                    "causes": [causes.NLOS_ENV, causes.HIGH_INTERFERNECE],
                                    "solutions": [solutions.ADDITIONAL_AP_NLOS, solutions.MOVE_LOC_TO_NLOS, solutions.REMOVE_INTERFERENCE]
                                };
                                if(apData["numTxPkts"][i][`sta${j+1}`] === 0) {
                                    item.causes.push(causes.NOT_USE);
                                }
                                results[idx].problems.push(item);
                            }
                            problemOn[2] = true;
                        }
                    }
                    cnt++;
                    if (cnt === apData["throughput"][i]["number"]) break;
                }
            }
        }
        console.log(results);
        setSummary(results);
    }, []);

	return (
        <div style={{ ...componentStyles, width: props.width, height: props.height, borderRadius: 10 }}>
            <StyledTypography variant="h6" component="div" sx={{ padding: `${padding}px`}}>
                Total Summary
            </StyledTypography>
            <div className="scroll" style={{ height: `${props.height-40-2*padding}px`}}>
                {summary.map((result, i) => {
                    return DisplayResults(i, result);
                })}
            </div>    
        </div>
    )
};
export default TotalSummary;
