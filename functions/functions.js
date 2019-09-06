function toCsv(arr) {
    let str = '';
    for (let i in arr) {
        str += arr[i].toString() + '\n';
    }
    return str;
}

function findPrimCol(arr, splitter) {
    for (let i = 0; i < arr.length; i++) {
        if ((typeof arr[i] == 'string') && (arr[i].includes(splitter))) {
            return i;
        }
    }
    return -1;
}
  
function checkArrPrim(arr, splitter) {
    let ind;
    for (let i in arr) {
        ind = findPrimCol(arr[i], splitter);
        if (ind > -1) {
            return ind;
        }
    }
    return ind;
}
  
// Check arr for prim column
// If it exists, go through array and 
async function parsePrimitiveArr(arr, splitter) {
    let finalArr = [];
    let stagingArr = [];
    let workingArr = [];
    let primInd = findPrimCol(arr, splitter);
    stagingArr.push(arr);

    let beforePrim;
    let prim;
    let afterPrim;
    
    while (primInd > 0) {
        for (let i in stagingArr) {
            beforePrim = stagingArr[i].slice(0, primInd);
            prim = stagingArr[i][primInd].split(splitter);
            afterPrim = stagingArr[i].slice(primInd + 1);
            for (let j in prim) {
                workingArr = [];
                workingArr = workingArr.concat(beforePrim);
                workingArr = workingArr.concat(prim[j]);
                workingArr = workingArr.concat(afterPrim);
                finalArr.push(workingArr);
            }
        }
        primInd = checkArrPrim(finalArr, splitter);
        stagingArr = finalArr;
        finalArr = [];
    }
    return stagingArr;
}

async function handlePrimArr(csv, splitter) {
    let res = csv.split('\n').map(e => e.split(',').map(e => e.trim())); 
    let stagingArr = [];
    let counter = 0;
    for (let ind in res) {
        stagingArr.push(await parsePrimitiveArr(res[ind], splitter));
        counter ++;

        if (counter == res.length) {
            return await toCsv([].concat.apply([], stagingArr));
        }
    }
}

module.exports = { 
    handlePrimArr: handlePrimArr
}