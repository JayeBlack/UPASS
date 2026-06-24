const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Grade data for cosmos baidoo
const gradeData = [
  { index_number: 'foe002', course_code: 'PE 500', course_name: 'Thesis', credits: 3, score: 75 },
  { index_number: 'foe002', course_code: 'PE 511', course_name: 'Introduction to Petroleum Engineering', credits: 3, score: 82 },
  { index_number: 'foe002', course_code: 'PE 513', course_name: 'Introduction to Engineering Mechanics', credits: 3, score: 68 },
  { index_number: 'foe002', course_code: 'PE 550', course_name: 'Graduate Seminar', credits: 3, score: 91 },
  { index_number: 'foe002', course_code: 'PE 556', course_name: 'Labwork/Fieldwork and Report', credits: 3, score: 77 },
  { index_number: 'foe002', course_code: 'PE 574', course_name: 'Health, Safety and Environment in Petroleum Industry', credits: 3, score: 85 }
];

// UMaT Grading System
function getGrade(score) {
  if (score >= 80) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'D+';
  if (score >= 50) return 'D';
  return 'F';
}

function getGradePoint(score) {
  if (score >= 80) return 4.0;
  if (score >= 75) return 3.5;
  if (score >= 70) return 3.0;
  if (score >= 65) return 2.5;
  if (score >= 60) return 2.0;
  if (score >= 55) return 1.5;
  if (score >= 50) return 1.0;
  return 0.0;
}

// Prepare data for Excel
const excelData = gradeData.map(row => ({
  'Index Number': row.index_number,
  'Course Code': row.course_code,
  'Course Name': row.course_name,
  'Credits': row.credits,
  'Score': row.score,
  'Grade': getGrade(row.score),
  'Grade Point': getGradePoint(row.score),
  'Quality Points': (getGradePoint(row.score) * row.credits).toFixed(2)
}));

// Calculate summary
const totalCredits = gradeData.reduce((sum, row) => sum + row.credits, 0);
const totalQualityPoints = gradeData.reduce((sum, row) => sum + (getGradePoint(row.score) * row.credits), 0);
const gpa = (totalQualityPoints / totalCredits).toFixed(2);
const averageScore = (gradeData.reduce((sum, row) => sum + row.score, 0) / gradeData.length).toFixed(2);

// Add summary rows
excelData.push({});
excelData.push({
  'Index Number': 'SUMMARY',
  'Course Code': '',
  'Course Name': '',
  'Credits': totalCredits,
  'Score': averageScore,
  'Grade': '',
  'Grade Point': '',
  'Quality Points': totalQualityPoints.toFixed(2)
});
excelData.push({
  'Index Number': 'GPA',
  'Course Code': '',
  'Course Name': '',
  'Credits': '',
  'Score': gpa,
  'Grade': '',
  'Grade Point': '',
  'Quality Points': ''
});

// Create workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(excelData);

// Set column widths
ws['!cols'] = [
  { wch: 15 },  // Index Number
  { wch: 12 },  // Course Code
  { wch: 55 },  // Course Name
  { wch: 8 },   // Credits
  { wch: 8 },   // Score
  { wch: 8 },   // Grade
  { wch: 12 },  // Grade Point
  { wch: 15 }   // Quality Points
];

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Grades');

// Write to file
const outputPath = path.join(__dirname, 'cosmos_baidoo_grades.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ Excel file created successfully!');
console.log(`📁 Location: ${outputPath}`);
console.log('\n📊 Grade Summary:');
console.log(`   Student: cosmos baidoo (foe002)`);
console.log(`   Total Courses: ${gradeData.length}`);
console.log(`   Total Credits: ${totalCredits}`);
console.log(`   Average Score: ${averageScore}`);
console.log(`   GPA: ${gpa}/4.0`);
console.log('\n📝 Course Breakdown:');
gradeData.forEach(row => {
  const grade = getGrade(row.score);
  const gp = getGradePoint(row.score);
  console.log(`   ${row.course_code}: ${row.score} (${grade}, ${gp}) - ${row.course_name}`);
});
