'use strict';
module.exports = function diff(a, b) {
    let dif = [];

    a = a.split(/\n/);
    b = b.split(/\n/);

    let cursorA, cursorB, pointB = 0, pointA = 0;
    for(cursorA = 0; cursorA < a.length; cursorA++) {
        let pairFound = false;
        for (cursorB = pointB; cursorB < b.length; cursorB++) {
            if (a[cursorA] == b[cursorB]) {
                let skip = false; // lookup for cross pairs
                for (let line = cursorA + 1; line < cursorB; line++) if (a[line] == b[line]) skip = true;
                if (!skip) pairFound = true;
                break;
            }
        }

        if (pairFound) {
            if (cursorA > pointA || cursorB > pointB)
            for (let line = Math.min(cursorA, cursorB, pointB, pointA); line < Math.max(cursorA, cursorB, pointB, pointA); line++) {
                if (line < pointA || line >= cursorA) dif.push({status: '+', a: null, b: b[line]});
                else if (line < pointB || line >= cursorB) dif.push({status: '-', a: a[line], b: null});
                else dif.push({status: '*', a: a[line], b: b[line]});
            }

            dif.push({status: '=', a: a[cursorA], b: b[cursorB]});

            pointA = cursorA + 1;
            pointB = cursorB + 1;
        }
    }

    if (pointA != cursorA || pointB - 1 != cursorB || pointB < b.length) {
        for (cursorA = pointA, cursorB = pointB; cursorA < a.length || cursorB < b.length; cursorA++, cursorB++) {
            if (a[cursorA] && b[cursorB]) dif.push({status: '*', a: a[cursorA], b: b[cursorB]});
            else if (a[cursorA] !== undefined) dif.push({status: '-', a: a[cursorA], b: null});
            else dif.push({status: '+', a: null, b: b[cursorB]});
        }
    }

    return dif;
};
