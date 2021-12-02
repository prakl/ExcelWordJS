const fs = require('fs');
const xlsx = require('node-xlsx').default;

// Parse a buffer
const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`D:/ExcelWordJS/dolgs01.09.2021.xlsx`));
// Parse a file
const workSheetsFromFile = xlsx.parse('D:/ExcelWordJS/dolgs01.09.2021.xlsx');

// var arrayTitle =  Array.from(workSheetsFromFile[0].data[0])

var arrObjects = [];
for (let i = 3; i < workSheetsFromFile[0].data.length ; i++) {
    var obj = {};
    for (let j = 0; j < workSheetsFromFile[0].data[2].length; j++) {
        obj[workSheetsFromFile[0].data[2][j]] = workSheetsFromFile[0].data[i][j];
    }
    arrObjects[i-3] = obj;
}
console.log(arrObjects);
