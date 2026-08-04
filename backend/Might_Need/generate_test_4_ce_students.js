const XLSX = require('xlsx');
const path = require('path');

// Read the 4 CE students with real phone numbers from sample_bulk_students.xlsx
const studentsPath = path.join(__dirname, '..', 'excel-files', 'sample_bulk_students.xlsx');
const wb = XLSX.readFile(studentsPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const all = XLSX.utils.sheet_to_json(ws);

const CE_PHONES = ['0531399032', '0548329408', '0592826345', '0595799116'];

const ceStudents = all.filter(s => s['Phone Number'] && CE_PHONES.includes(s['Phone Number']));

const wsData = [
  ['Name', 'Index Number', 'Email', 'Programme', 'Department', 'Cohort', 'Academic Year', 'Phone Number'],
  ...ceStudents.map(s => [
    s['Name'], s['Index Number'], s['Email'], s['Programme'],
    s['Department'], s['Cohort'], s['Academic Year'], s['Phone Number'],
  ]),
];

const outWb = XLSX.utils.book_new();
const outWs = XLSX.utils.aoa_to_sheet(wsData);
outWs['!cols'] = [
  { wch: 20 }, { wch: 18 }, { wch: 35 }, { wch: 45 },
  { wch: 40 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
];
XLSX.utils.book_append_sheet(outWb, outWs, 'Students');

const outputPath = path.join(__dirname, '..', 'excel-files', 'test_4_ce_students.xlsx');
XLSX.writeFile(outWb, outputPath);

console.log(`✅ Generated test_4_ce_students.xlsx`);
console.log(`📁 Saved to: ${outputPath}`);
ceStudents.forEach(s => console.log(`   • ${s['Name']} | ${s['Index Number']} | ${s['Phone Number']}`));
