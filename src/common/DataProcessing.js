export function dataPreprocessing(data) {
    return data.map(d => {
        const number = parseInt(d.number);
        let sum = 0;
        let squareSum = 0;
        let cnt = 0;
        for (let i=1; ;i++) {
            if (d[`sta${i}`] === -1.0) continue;
            d[`sta${i}`] = parseFloat(d[`sta${i}`]);
            sum += d[`sta${i}`];
            squareSum += d[`sta${i}`]*d[`sta${i}`];
            cnt++;
            if (cnt === number) break;
        }
        return{
            ...d, 
            "time": parseFloat(d.time),
            "section": parseInt(d.section), 
            "number": number,
            "fairness": (sum*sum)/(cnt*squareSum),
            "total": parseFloat(d.total)
        }
    });
}

