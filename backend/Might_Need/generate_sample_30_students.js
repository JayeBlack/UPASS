const XLSX = require('xlsx');
const path = require('path');

const firstNames = [
  'Kwame', 'Kofi', 'Yaw', 'Kwabena', 'Kwaku', 'Yaa', 'Akosua', 'Adwoa', 'Abena', 'Akua',
  'Kojo', 'Kwesi', 'Adjoa', 'Ama', 'Efua', 'Afi', 'Kobina', 'Ekua', 'Esi', 'Afia',
  'Kwadwo', 'Ebo', 'Ato', 'Kodwo', 'Araba', 'Panyin', 'Kakra', 'Mansa', 'Serwa', 'Nana'
];

const lastNames = [
  'Mensah', 'Asante', 'Appiah', 'Osei', 'Owusu', 'Boateng', 'Agyemang', 'Frimpong', 'Sarpong', 'Darko',
  'Annan', 'Nkrumah', 'Acheampong', 'Ofori', 'Ansah', 'Addo', 'Boakye', 'Opoku', 'Gyasi', 'Danquah',
  'Afriyie', 'Amoah', 'Yeboah', 'Amankwah', 'Adjei', 'Agyei', 'Akuffo', 'Wiredu', 'Quaye', 'Tetteh'
];

const departments = {
  'Computer Science and Engineering': [
    'Computer Science and Engineering MSc',
    'Computer Science and Engineering MPhil',
  ],
  'Electrical and Electronic Engineering': [
    'Electrical and Electronic Engineering MSc',
    'Electrical and Electronic Engineering MPhil',
  ],
  'Mining Engineering': [
    'Mining Engineering MSc',
    'Mining Engineering MPhil',
  ],
  'Geomatic Engineering': [
    'Geomatic Engineering MSc',
    'Geomatic Engineering MPhil',
  ],
  'Mechanical Engineering': [
    'Mechanical Engineering MSc',
    'Mechanical Engineering MPhil',
  ],
  'Petroleum Engineering': [
    'Petroleum Engineering MSc',
    'Petroleum Engineering MPhil',
  ],
  'Geological Engineering': [
    'Geological Engineering MSc',
    'Geological Engineering MPhil',
  ],
  'Minerals Engineering': [
    'Minerals Engineering MSc',
    'Minerals Engineering MPhil',
  ],
  'Mathematical Sciences': [
    'Mathematical Sciences MSc',
    'Mathematical Sciences MPhil',
  ],
  'Management Studies': [
    'Management Studies MSc',
    'Management Studies MBA',
  ],
  'Environmental and Safety Engineering': [
    'Environmental and Safety Engineering MSc',
    'Environmental and Safety Engineering MPhil',
  ],
};

const deptNames = Object.keys(departments);

// Fixed 30 students — indexes start at 0301 to avoid clashing with sample_bulk_students.xlsx (0001-0300)
// Emails use suffix 's' + idx to guarantee uniqueness
const students = [
  // 2022 cohort (8 students)
  { firstName: 'Kwame',   lastName: 'Mensah',      idx: '0301', year: '22', cohort: 'January', dept: deptNames[0] },
  { firstName: 'Akosua',  lastName: 'Asante',      idx: '0302', year: '22', cohort: 'July',    dept: deptNames[1] },
  { firstName: 'Kofi',    lastName: 'Boateng',     idx: '0303', year: '22', cohort: 'January', dept: deptNames[2] },
  { firstName: 'Yaa',     lastName: 'Appiah',      idx: '0304', year: '22', cohort: 'July',    dept: deptNames[3] },
  { firstName: 'Kojo',    lastName: 'Osei',        idx: '0305', year: '22', cohort: 'January', dept: deptNames[4] },
  { firstName: 'Adwoa',   lastName: 'Frimpong',    idx: '0306', year: '22', cohort: 'July',    dept: deptNames[5] },
  { firstName: 'Yaw',     lastName: 'Sarpong',     idx: '0307', year: '22', cohort: 'January', dept: deptNames[6] },
  { firstName: 'Abena',   lastName: 'Owusu',       idx: '0308', year: '22', cohort: 'July',    dept: deptNames[7] },

  // 2024 cohort (22 students)
  { firstName: 'Kwabena', lastName: 'Agyemang',    idx: '0309', year: '24', cohort: 'January', dept: deptNames[8]  },
  { firstName: 'Akua',    lastName: 'Darko',       idx: '0310', year: '24', cohort: 'July',    dept: deptNames[9]  },
  { firstName: 'Kwesi',   lastName: 'Annan',       idx: '0311', year: '24', cohort: 'January', dept: deptNames[10] },
  { firstName: 'Adjoa',   lastName: 'Nkrumah',     idx: '0312', year: '24', cohort: 'July',    dept: deptNames[0]  },
  { firstName: 'Ama',     lastName: 'Acheampong',  idx: '0313', year: '24', cohort: 'January', dept: deptNames[1]  },
  { firstName: 'Efua',    lastName: 'Ofori',       idx: '0314', year: '24', cohort: 'July',    dept: deptNames[2]  },
  { firstName: 'Kobina',  lastName: 'Ansah',       idx: '0315', year: '24', cohort: 'January', dept: deptNames[3]  },
  { firstName: 'Ekua',    lastName: 'Addo',        idx: '0316', year: '24', cohort: 'July',    dept: deptNames[4]  },
  { firstName: 'Esi',     lastName: 'Boakye',      idx: '0317', year: '24', cohort: 'January', dept: deptNames[5]  },
  { firstName: 'Afia',    lastName: 'Opoku',       idx: '0318', year: '24', cohort: 'July',    dept: deptNames[6]  },
  { firstName: 'Kwadwo',  lastName: 'Gyasi',       idx: '0319', year: '24', cohort: 'January', dept: deptNames[7]  },
  { firstName: 'Ebo',     lastName: 'Danquah',     idx: '0320', year: '24', cohort: 'July',    dept: deptNames[8]  },
  { firstName: 'Ato',     lastName: 'Afriyie',     idx: '0321', year: '24', cohort: 'January', dept: deptNames[9]  },
  { firstName: 'Kodwo',   lastName: 'Amoah',       idx: '0322', year: '24', cohort: 'July',    dept: deptNames[10] },
  { firstName: 'Araba',   lastName: 'Yeboah',      idx: '0323', year: '24', cohort: 'January', dept: deptNames[0]  },
  { firstName: 'Panyin',  lastName: 'Amankwah',    idx: '0324', year: '24', cohort: 'July',    dept: deptNames[1]  },
  { firstName: 'Kakra',   lastName: 'Adjei',       idx: '0325', year: '24', cohort: 'January', dept: deptNames[2]  },
  { firstName: 'Mansa',   lastName: 'Agyei',       idx: '0326', year: '24', cohort: 'July',    dept: deptNames[3]  },
  { firstName: 'Serwa',   lastName: 'Akuffo',      idx: '0327', year: '24', cohort: 'January', dept: deptNames[4]  },
  { firstName: 'Nana',    lastName: 'Wiredu',      idx: '0328', year: '24', cohort: 'July',    dept: deptNames[5]  },
  { firstName: 'Kwaku',   lastName: 'Quaye',       idx: '0329', year: '24', cohort: 'January', dept: deptNames[6]  },
  { firstName: 'Afi',     lastName: 'Tetteh',      idx: '0330', year: '24', cohort: 'July',    dept: deptNames[7]  },
];

const rows = students.map(s => {
  const admYear = parseInt('20' + s.year);
  const programs = departments[s.dept];
  const program = programs[parseInt(s.idx) % 2];
  return [
    `${s.firstName} ${s.lastName}`,
    `UMaT/PG/${s.idx}/${s.year}`,
    `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}.s${s.idx}@umat.edu.gh`,
    program,
    s.dept,
    s.cohort,
    admYear,
  ];
});

const wsData = [
  ['Name', 'Index Number', 'Email', 'Programme', 'Department', 'Cohort', 'Admission Year'],
  ...rows,
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(wsData);
ws['!cols'] = [
  { wch: 22 }, { wch: 18 }, { wch: 38 }, { wch: 45 }, { wch: 40 }, { wch: 12 }, { wch: 15 },
];

XLSX.utils.book_append_sheet(wb, ws, 'Students');

const outputPath = require('path').join(__dirname, '..', 'excel-files', 'sample_30_students.xlsx');
XLSX.writeFile(wb, outputPath);
console.log(`✅ Created sample_30_students.xlsx with ${rows.length} students`);
console.log(`📁 Saved to: ${outputPath}`);
