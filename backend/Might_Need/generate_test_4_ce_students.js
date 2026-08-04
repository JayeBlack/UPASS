const XLSX = require('xlsx');
const path = require('path');

const CE_PHONES = ['0531399032', '0548329408', '0592826345', '0595799116'];

// Load the 4 CE students from bulk students file
const studentsPath = path.join(__dirname, '..', 'excel-files', 'sample_bulk_students.xlsx');
const studentsWb = XLSX.readFile(studentsPath);
const studentsWs = studentsWb.Sheets[studentsWb.SheetNames[0]];
const allStudents = XLSX.utils.sheet_to_json(studentsWs);
const ceStudents = allStudents.filter(s => CE_PHONES.includes(s['Phone Number']));

const payments = ceStudents.map(s => ({
  'Index Number': s['Index Number'],
  'Student Name': s['Name'],
  'Total Amount': 8000,
  'Amount Paid': 5000,
  'Academic Year': '2024/2025',
  'Semester': 'First',
}));

const ws = XLSX.utils.json_to_sheet(payments);
ws['!cols'] = [
  { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Fees');

const outputPath = path.join(__dirname, '..', 'excel-files', 'test_4_ce_students.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ Generated test_4_ce_students.xlsx (fee records for 4 CE students)');
ceStudents.forEach((s, i) => console.log(`   • ${s['Name']} | ${s['Index Number']} | GHS 5000 of 8000 paid`));
