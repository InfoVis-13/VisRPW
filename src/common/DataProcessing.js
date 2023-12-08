import { criteria, labels } from './Constants.js';

export function preprocessData(data) {
    return data.map(d => {
        const number = parseInt(d.number);
        let cnt = 0;
        for (let i=1; ;i++) {
            d[`sta${i}`] = parseFloat(d[`sta${i}`]);
            if (d[`sta${i}`] === -1.0) continue;
            cnt++;
            if (cnt === number) break;
        }
        return{
            ...d, 
            "time": parseFloat(d.time),
            "section": parseInt(d.section), 
            "number": number,
            "total": parseFloat(d.total)
        }
    });
}


export function processTimeTputWithFairnessData(data) {
    let statsData = [];
    console.log(Object.keys(data));
    for (var idx in data){
        const key = data[idx]["key"];
        let tmp = data[idx]["throughput"].map(d => {
            let sum = 0;
            let squareSum = 0;
            let cnt = 0;
            for (let i=1; ;i++) {
                if (d[`sta${i}`] === -1.0) continue;
                d[`sta${i}`] = parseFloat(d[`sta${i}`]);
                sum += d[`sta${i}`];
                squareSum += d[`sta${i}`]*d[`sta${i}`];
                cnt++;
                if (cnt === d.number) break;
            }
            return {
                "key": key,
                "time": d.time,
                "number": d.number,
                "total": d.total,
                "avg": d.total/d.number,
                "fairness": (sum*sum)/(cnt*squareSum)
            };
        });
        statsData = statsData.concat(tmp);
    }
    return statsData;
}

export function processDevNumDevGroupData(data) {
    let statsData = [];

    for(let i=0; i<data.length; i++) {
        let d = data[i];
        let eachData = {
            "veryGood": 0,
            "good" : 0,
            "normal": 0,
            "poor" : 0,
            "veryPoor" : 0
        };
        let cnt = 0;
        for(let j=0; ; j++){
            if (d[`sta${j+1}`] === -1.0) continue;
            let labIdx = 0;
            for(labIdx; labIdx<criteria.length; labIdx++){
                if(d[`sta${j+1}`] <= criteria[labIdx]) break;
            }
            eachData[labels[labIdx]]++;
            cnt++;
            if (cnt === d.number) break;
        }
        for (let j=0; j<labels.length; j++) {
        statsData.push({
            "time": d.time,
            "number": d.number,
            "label": labels[j],
            "count": eachData[labels[j]]
        });
        }
    }
    return statsData;
}