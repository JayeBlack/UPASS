const XLSX = require('xlsx');
const path = require('path');

// 10 users — one per key role, referencing the same structure as sample_bulk_users.xlsx
const users = [
  { Name: 'Dr. John Mensah',      Email: 'john.mensah@umat.edu.gh',      Role: 'Supervisor',           Department: 'Computer Science and Engineering',    Phone: '0244123456' },
  { Name: 'Prof. Grace Asante',   Email: 'grace.asante@umat.edu.gh',     Role: 'Supervisor',           Department: 'Electrical and Electronic Engineering', Phone: '0244123457' },
  { Name: 'Kwesi Adjei',          Email: 'kwesi.adjei@umat.edu.gh',      Role: 'Admin',                Department: 'School of Postgraduate Studies',       Phone: '0244123464' },
  { Name: 'Efua Mensah',          Email: 'efua.mensah@umat.edu.gh',      Role: 'Registrar',            Department: 'School of Postgraduate Studies',       Phone: '0244123465' },
  { Name: 'Peter Bonsu',          Email: 'peter.bonsu@umat.edu.gh',      Role: 'ExamsOfficer',         Department: 'School of Postgraduate Studies',       Phone: '0244123466' },
  { Name: 'Adwoa Kwarteng',       Email: 'adwoa.kwarteng@umat.edu.gh',   Role: 'Accountant',           Department: 'Finance Office',                      Phone: '0244123467' },
  { Name: 'Daniel Frimpong',      Email: 'daniel.frimpong@umat.edu.gh',  Role: 'AccountingAssistant',  Department: 'Finance Office',                      Phone: '0244123484' },
  { Name: 'Prof. Kojo Nkrumah',   Email: 'kojo.nkrumah@umat.edu.gh',    Role: 'Dean',                 Department: 'Computer Science and Engineering',    Phone: '0244123468' },
  { Name: 'Dr. Akua Sarpong',     Email: 'akua.sarpong@umat.edu.gh',    Role: 'ViceDean',             Department: 'Electrical and Electronic Engineering', Phone: '0244123469' },
  { Name: 'Francis Ofosu',        Email: 'francis.ofosu@umat.edu.gh',   Role: 'AdminAssistant',       Department: 'School of Postgraduate Studies',       Phone: '0244123470' },
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
