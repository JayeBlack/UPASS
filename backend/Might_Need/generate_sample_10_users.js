const XLSX = require('xlsx');
const path = require('path');

// 10 users — one per key role, all names/emails distinct from sample_bulk_users.xlsx
const users = [
  { Name: 'Dr. Nana Wiredu',       Email: 'nana.wiredu@umat.edu.gh',      Role: 'Supervisor',          Department: 'Computer Science and Engineering',       Phone: '0244200101' },
  { Name: 'Prof. Esi Turkson',     Email: 'esi.turkson@umat.edu.gh',      Role: 'Supervisor',          Department: 'Electrical and Electronic Engineering',  Phone: '0244200102' },
  { Name: 'Mansa Darko',           Email: 'mansa.darko@umat.edu.gh',      Role: 'Admin',               Department: 'School of Postgraduate Studies',         Phone: '0244200103' },
  { Name: 'Kakra Tetteh',          Email: 'kakra.tetteh@umat.edu.gh',     Role: 'Registrar',           Department: 'School of Postgraduate Studies',         Phone: '0244200104' },
  { Name: 'Serwa Quaye',           Email: 'serwa.quaye@umat.edu.gh',      Role: 'ExamsOfficer',        Department: 'School of Postgraduate Studies',         Phone: '0244200105' },
  { Name: 'Ato Gyasi',             Email: 'ato.gyasi@umat.edu.gh',        Role: 'Accountant',          Department: 'School of Postgraduate Studies',         Phone: '0244200106' },
  { Name: 'Araba Acquah',          Email: 'araba.acquah@umat.edu.gh',     Role: 'AccountingAssistant', Department: 'School of Postgraduate Studies',         Phone: '0244200107' },
  { Name: 'Prof. Kodwo Poku',      Email: 'kodwo.poku@umat.edu.gh',       Role: 'Dean',                Department: 'Mining Engineering',                    Phone: '0244200108' },
  { Name: 'Dr. Panyin Asiedu',     Email: 'panyin.asiedu@umat.edu.gh',    Role: 'ViceDean',            Department: 'Geological Engineering',                Phone: '0244200109' },
  { Name: 'Ebo Nyarko',            Email: 'ebo.nyarko@umat.edu.gh',       Role: 'AdminAssistant',      Department: 'School of Postgraduate Studies',         Phone: '0244200110' },
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(users);
ws['!cols'] = [
  { wch: 25 }, // Name
  { wch: 35 }, // Email
  { wch: 22 }, // Role
  { wch: 42 }, // Department
  { wch: 15 }, // Phone
];

XLSX.utils.book_append_sheet(wb, ws, 'Users');

const outputPath = path.join(__dirname, '..', 'excel-files', 'sample_10_users.xlsx');
XLSX.writeFile(wb, outputPath);
console.log(`✅ Created sample_10_users.xlsx with ${users.length} users`);
console.log(`📁 Saved to: ${outputPath}`);

const roleCounts = {};
users.forEach(u => { roleCounts[u.Role] = (roleCounts[u.Role] || 0) + 1; });
console.log('\n   Distribution by role:');
Object.entries(roleCounts).forEach(([role, count]) => console.log(`   - ${role}: ${count}`));
