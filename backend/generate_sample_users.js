const XLSX = require('xlsx');

// Roles available in the system
const roles = [
  'Supervisor',
  'Admin', 
  'Dean',
  'ViceDean',
  'Registrar',
  'AdminAssistant',
  'Accountant',
  'AccountingAssistant',
  'ExamsOfficer'
];

// 10 Departments
const departments = [
  'Computer Science',
  'Electrical and Electronic Engineering',
  'Environmental and Safety Engineering',
  'Finance Office',
  'Geomatic Engineering',
  'Mathematical Sciences',
  'Mechanical Engineering',
  'Mining Engineering',
  'Petroleum Engineering',
  'School of Postgraduate Studies'
];

// Ghanaian staff names
const staffNames = [
  'Dr. Kwame Nkrumah',
  'Prof. Ama Ata Aidoo',
  'Dr. Kofi Annan',
  'Prof. Yaw Osafo',
  'Dr. Akosua Mensah',
  'Prof. Kwabena Boateng',
  'Dr. Abena Osei',
  'Prof. Kwesi Appiah',
  'Dr. Efua Asante',
  'Prof. Yaw Frimpong',
  'Dr. Akwasi Owusu',
  'Prof. Adwoa Amoah',
  'Dr. Kojo Adjei',
  'Prof. Esi Gyamfi',
  'Dr. Fiifi Darko',
  'Prof. Afua Danso',
  'Dr. Kwame Boakye',
  'Prof. Ama Kusi',
  'Dr. Nana Agyei',
  'Prof. Akua Ofori'
];

// Generate user data
const users = [];

for (let i = 0; i < 20; i++) {
  const name = staffNames[i];
  const firstName = name.split(' ').pop().toLowerCase();
  const email = `${firstName}${i + 1}@umat.edu.gh`;
  const role = roles[i % roles.length];
  const department = departments[i % departments.length];
  const phone = `+233${Math.floor(200000000 + Math.random() * 300000000)}`;
  
  users.push({
    Name: name,
    Email: email,
    Role: role,
    Department: department,
    Phone: phone
  });
}

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(users);

// Set column widths
ws['!cols'] = [
  { wch: 30 },  // Name
  { wch: 30 },  // Email
  { wch: 25 },  // Role
  { wch: 45 },  // Department
  { wch: 20 }   // Phone
];

XLSX.utils.book_append_sheet(wb, ws, 'Users');

// Write file
XLSX.writeFile(wb, 'sample_bulk_users.xlsx');

console.log('✅ Generated sample_bulk_users.xlsx with 20 staff users');
console.log('📊 Distribution:');
console.log(`   - 20 staff across all departments`);
console.log(`   - All 9 roles covered`);
console.log(`   - Default password: email prefix (before @)`);
console.log('\n📁 File location: sample_bulk_users.xlsx');
console.log('\n✅ Expected columns: Name, Email, Role, Department, Phone');
console.log('\n🚀 Upload this file in Super Admin → Manage Users → Bulk Upload');
