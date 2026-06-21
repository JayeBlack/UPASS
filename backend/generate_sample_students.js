const XLSX = require('xlsx');

// 10 Departments from the system
const departments = [
  'Computer Science',
  'Electrical Engineering',
  'Environmental and Safety Engineering',
  'Finance Office',
  'Geomatic Engineering',
  'Mathematical Sciences',
  'Mechanical Engineering',
  'Mining Engineering',
  'Petroleum Engineering',
  'School of Postgraduate Studies'
];

// Programmes mapped to departments (EXACT names from programmeCourses.ts)
const programmes = {
  'Computer Science': [
    'Computer Science and Engineering (MSc / MPhil)'
  ],
  'Electrical Engineering': [
    'Electrical and Electronic Engineering (MSc / MPhil)',
    'Electrical and Electronic Engineering (PhD)',
    'Electrical and Electronic Engineering (MSc / MPhil) — July',
    'Electrical and Electronic Engineering (PhD) — July'
  ],
  'Environmental and Safety Engineering': [
    'Occupational Health and Safety (MSc / MPhil / PhD) — July'
  ],
  'Finance Office': [
    'Master of Business and Technology Management — Finance and Investment (July)'
  ],
  'Geomatic Engineering': [
    'Geomatic Engineering (MSc / MPhil)',
    'Geomatic Engineering (PhD)'
  ],
  'Mathematical Sciences': [
    'Mathematics (MSc / MPhil)',
    'Mathematics (PhD)',
    'Mathematical Sciences (MSc / MPhil)'
  ],
  'Mechanical Engineering': [
    'Mechanical Engineering (MSc / MPhil)',
    'Mechanical Engineering (PhD)'
  ],
  'Mining Engineering': [
    'Mining Engineering (MSc / MPhil) — July',
    'Postgraduate Diploma in Mining Engineering (July)'
  ],
  'Petroleum Engineering': [
    'Petroleum Engineering (MSc / MPhil)',
    'Petroleum Engineering (PhD)',
    'Petroleum Refining and Petrochemical Engineering (MSc / MPhil) — July'
  ],
  'School of Postgraduate Studies': [
    'Master of Business and Technology Management — Supply Chain Management (July)',
    'Master of Business and Technology Management — Management Information Systems (July)',
    'Master of Business and Technology Management — Strategic Human Resource Management (July)',
    'MSc Engineering Management (July)'
  ]
};

// Ghanaian first names
const firstNames = [
  'Kwame', 'Kofi', 'Yaw', 'Kwabena', 'Kwaku', 'Ama', 'Akua', 'Afia', 'Abena', 'Afua',
  'Kwesi', 'Nana', 'Agyei', 'Agyemang', 'Akosua', 'Adwoa', 'Adjoa', 'Efua', 'Ekua',
  'Akwasi', 'Osei', 'Mensah', 'Boateng', 'Asante', 'Owusu', 'Appiah', 'Amoah'
];

// Ghanaian last names
const lastNames = [
  'Mensah', 'Boateng', 'Asante', 'Owusu', 'Appiah', 'Amoah', 'Adjei', 'Osei',
  'Agyei', 'Agyemang', 'Frimpong', 'Danso', 'Antwi', 'Boakye', 'Yeboah', 'Ofosu',
  'Addo', 'Kusi', 'Acheampong', 'Darko', 'Gyamfi', 'Ofori', 'Amponsah', 'Kyei'
];

// Cohort cycles
const cohorts = ['January', 'July'];

// Generate student data
const students = [];
let indexCounter = 1;

for (let i = 0; i < 60; i++) {
  const deptIndex = i % departments.length;
  const department = departments[deptIndex];
  const deptProgrammes = programmes[department];
  const programme = deptProgrammes[i % deptProgrammes.length];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  
  // Generate index number: UMaT/PG/XXXX/24
  const indexNumber = `UMaT/PG/${String(indexCounter).padStart(4, '0')}/24`;
  indexCounter++;
  
  // Generate email
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@umat.edu.gh`;
  
  // Alternate cohorts
  const cohort = cohorts[i % 2];
  
  students.push({
    Name: name,
    'Index Number': indexNumber,
    Email: email,
    Programme: programme,
    Department: department,
    Cohort: cohort
  });
}

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(students);

// Set column widths
ws['!cols'] = [
  { wch: 25 },  // Name
  { wch: 20 },  // Index Number
  { wch: 35 },  // Email
  { wch: 35 },  // Programme
  { wch: 40 },  // Department
  { wch: 15 }   // Cohort
];

XLSX.utils.book_append_sheet(wb, ws, 'Students');

// Write file
XLSX.writeFile(wb, 'sample_bulk_students_corrected.xlsx');

console.log('✅ Generated sample_bulk_students_corrected.xlsx with 60 students');
console.log('📊 Distribution:');
console.log(`   - 10 departments covered`);
console.log(`   - ${students.filter(s => s.Cohort === 'January').length} January cohort students`);
console.log(`   - ${students.filter(s => s.Cohort === 'July').length} July cohort students`);
console.log(`   - Index numbers: UMaT/PG/0001/24 to UMaT/PG/0060/24`);
console.log('\n📁 File location: sample_bulk_students_corrected.xlsx');
console.log('\n✅ Programme names now match system catalog exactly');
console.log('\n🚀 Upload this file in Admin → Manage Students → Bulk Upload');
