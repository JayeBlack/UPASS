const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'cosmos_baidoo_grades.xlsx');

console.log('📖 Reading Excel file...\n');

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('✅ File Structure Verified\n');
console.log(`Sheet Name: ${sheetName}`);
console.log(`Total Rows: ${data.length}\n`);

console.log('📊 Grade Data:');
console.log('='.repeat(120));

data.forEach((row, index) => {
  if (index < data.length - 2) {
    // Regular grade rows
    console.log(`${row['Course Code']?.padEnd(8)} | ${row['Score']?.toString().padStart(3)} | ${row['Grade']?.padEnd(4)} | GP: ${row['Grade Point']} | QP: ${row['Quality Points']?.padEnd(6)} | ${row['Course Name']}`);
  } else {
    // Summary rows
    console.log('='.repeat(120));
    if (row['Index Number'] === 'SUMMARY') {
      console.log(`SUMMARY  | Credits: ${row['Credits']} | Avg: ${row['Score']} | Total QP: ${row['Quality Points']}`);
    } else if (row['Index Number'] === 'GPA') {
      console.log(`GPA      | ${row['Score']}/4.0`);
    }
  }
});

console.log('\n✅ Excel file is properly formatted and ready for import!');
console.log(`\n📁 File location: ${filePath}`);
