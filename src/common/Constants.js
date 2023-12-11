import * as d3 from "d3";

export const criteria = [1.0, 5.0, 15.0, 25.0];
export const labels = ["veryPoor", "poor", "normal", "good", "veryGood"];
// export const color = d3.scaleOrdinal()
//         .domain(labels)
//         .range(d3.schemeSpectral[labels.length])
//         .unknown("#ccc");
// let first = d3.quantize(d3.scaleLinear(["#d53e4f", "#f5c102"]).interpolate(d3.interpolateHcl), 3);
// let second = d3.quantize(d3.scaleLinear(["#f5c102", "rgb(19, 137, 134)"]).interpolate(d3.interpolateHcl), 3);
let first = d3.quantize(d3.scaleLinear(["#d53e4f", "#f5e907"]).interpolate(d3.interpolateHcl), 3);
let second = d3.quantize(d3.scaleLinear(["#f5e907", "rgb(19, 137, 134)"]).interpolate(d3.interpolateHcl), 3);
const devColorRange = ((first.slice(0,2)).concat("#f5c102")).concat(second.slice(1));
export const devGroupcolor = d3.scaleOrdinal()
        .domain(labels)
        .range(devColorRange)
        .unknown("#ccc");

export const apColor = [["MediumBlue", "orangered"],
                        ["cornflowerblue", "orange"],
                        ["skyblue", "lightsalmon"]];