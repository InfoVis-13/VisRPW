import * as d3 from "d3";

export const criteria = [1.0, 5.0, 15.0, 25.0];
export const labels = ["veryPoor", "poor", "normal", "good", "veryGood"];
// export const color = d3.scaleOrdinal()
//         .domain(labels)
//         .range(d3.schemeSpectral[labels.length])
//         .unknown("#ccc");
let first = d3.quantize(d3.scaleLinear(["#d53e4f", "rgb(250, 250, 110)"]).interpolate(d3.interpolateHcl), 3);
let second = d3.quantize(d3.scaleLinear(["rgb(250, 250, 110)", "rgb(19, 137, 134)"]).interpolate(d3.interpolateHcl), 3);
const colorRange = first.concat(second.slice(1));
export const color = d3.scaleOrdinal()
        .domain(labels)
        .range(colorRange)
        .unknown("#ccc");