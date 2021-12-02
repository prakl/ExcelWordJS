const fs = require('fs');
const xlsx = require('node-xlsx');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
function replaceErrors(key, value) {
  if (value instanceof Error) {
    // eslint-disable-next-line no-shadow
    return Object.getOwnPropertyNames(value).reduce((error, key) => {
      // eslint-disable-next-line no-param-reassign
      error[key] = value[key];
      return error;
    }, {});
  }
  return value;
}

function errorHandler(error) {
  console.log(JSON.stringify({ error }, replaceErrors));

  if (error.properties && error.properties.errors instanceof Array) {
    // eslint-disable-next-line no-shadow
    const errorMessages = error.properties.errors.map((error) => error.properties.explanation).join('\n');
    console.log('errorMessages', errorMessages);
    // errorMessages is a humanly readable message looking like this:
    // 'The tag beginning with "foobar" is unopened'
  }
  throw error;
}

function columnToNumber(str) {
  let num = 0;
  const arr = str.split('').reverse();
  for (let i = 0; i < arr.length; i += 1) {
    num += (arr[i].charCodeAt(0) - 64) * (26 ** i);
  }
  return num - 1;
}

const parseXLS = (xlsPath, startRowIdx, endRowIdx, headerRowIdx, fieldNameMap = {}, debtAlias) => {
  const worksheet = xlsx.parse(xlsPath);
  const headerRow = worksheet[0].data[headerRowIdx];
  let data = [];
  for (let i = startRowIdx; i <= endRowIdx; i += 1) {
    const obj = headerRow.reduce((acc, cur, idx) => {
      const fieldName = fieldNameMap[cur] || cur;
      return {
        ...acc,
        [fieldName]: worksheet[0].data[i][idx],
      };
    }, {});
    data.push(obj);
  }
  data = data.map((item) => {
    if (typeof item[debtAlias.alias] === 'number') {
      return item;
    }
    return {
      ...item,
      [debtAlias.alias]: Number.parseFloat(item[debtAlias.alias].replace(/[^0-9.-]/g, '')),
    };
  });
  data = data.filter((item) => item[debtAlias.alias] < 0);
  data = data.map((item) => ({
    ...item,
    [debtAlias.alias]: Math.abs(item[debtAlias.alias]),
  }));
  console.log(data);
  return data;
};

const generateDocx = (templatePath, templateData) => {
  const content = fs
    .readFileSync(templatePath, 'binary');

  const zip = new PizZip(content);
  let doc;
  try {
    doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  } catch (error) {
    errorHandler(error);
  }

  try {
    doc.render(templateData);
  } catch (error) {
    errorHandler(error);
  }

  return doc.getZip()
    .generate({ type: 'nodebuffer' });
};

const generateFieldNameMap = (xlsPath, aliases) => {
  const worksheet = xlsx.parse(xlsPath)[0];
  const map = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const alias of aliases) {
    const { column, row } = alias;
    const colNum = columnToNumber(column);
    map[worksheet.data[row - 1][colNum]] = alias.alias;
  }
  return map;
};

module.exports = {
  generateFieldNameMap,
  errorHandler,
  generateDocx,
  parseXLS,
};
