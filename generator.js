const fs = require('fs');
const path = require('path');

const { generateDocx, parseXLS } = require('./utils');

const fieldNameMap = {
  ФИО: 'name',
  '№ гаража': 'garageNumber',
  'ДОЛГ НА 01.09.21': 'debtAmount',
};

const data = parseXLS(path.resolve(__dirname, 'data.xlsx'), 3, 5, 2, fieldNameMap);

const docx = generateDocx(path.resolve(__dirname, 'template.docx'), { debts: data });

fs.writeFileSync(path.resolve(__dirname, 'output.docx'), docx);
