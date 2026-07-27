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

// Fixed 30 students — evenly spread across departments, cohorts, and admission years
const students = [
  // 2022 cohort (8 students — ~25%)
  { firstName: 'Kwame',   lastName: 'Mensah',      idx: '0001', year: '22', cohort: 'January', dept: deptNames[0] },
  { firstName: 'Akosua',  lastName: 'Asante',      idx: '0002', year: '22', cohort: 'July',    dept: deptNames[1] },
  { firstName: 'Kofi',    lastName: 'Boateng',     idx: '0003', year: '22', cohort: 'January', dept: deptNames[2] },
  { firstName: 'Yaa',     lastName: 'Appiah',      idx: '0004', year: '22', cohort: 'July',    dept: deptNames[3] },
  { firstName: 'Kojo',    lastName: 'Osei',        idx: '0005', year: '22', cohort: 'January', dept: deptNames[4] },
  { firstName: 'Adwoa',   lastName: 'Frimpong',    idx: '0006', year: '22', cohort: 'July',    dept: deptNames[5] },
  { firstName: 'Yaw',     lastName: 'Sarpong',     idx: '0007', year: '22', cohort: 'January', dept: deptNames[6] },
  { firstName: 'Abena',   lastName: 'Owusu',       idx: '0008', year: '22', cohort: 'July',    dept: deptNames[7] },

  // 2024 cohort (22 students — ~75%)
  { firstName: 'Kwabena', lastName: 'Agyemang',    idx: '0009', year: '24', cohort: 'January', dept: deptNames[8]  },
  { firstName: 'Akua',    lastName: 'Darko',       idx: '0010', year: '24', cohort: 'July',    dept: deptNames[9]  },
  { firstName: 'Kwesi',   lastName: 'Annan',       idx: '0011', year: '24', cohort: 'January', dept: deptNames[10] },
  { firstName: 'Adjoa',   lastName: 'Nkrumah',     idx: '0012', year: '24', cohort: 'July',    dept: deptNames[0]  },
  { firstName: 'Ama',     lastName: 'Acheampong',  idx: '0013', year: '24', cohort: 'January', dept: deptNames[1]  },
  { firstName: 'Efua',    lastName: 'Ofori',       idx: '0014', year: '24', cohort: 'July',    dept: deptNames[2]  },
  { firstName: 'Kobina',  lastName: 'Ansah',       idx: '0015', year: '24', cohort: 'January', dept: deptNames[3]  },
  { firstName: 'Ekua',    lastName: 'Addo',        idx: '0016', year: '24', cohort: 'July',    dept: deptNames[4]  },
  { firstName: 'Esi',     lastName: 'Boakye',      idx: '0017', year: '24', cohort: 'January', dept: deptNames[5]  },
  { firstName: 'Afia',    lastName: 'Opoku',       idx: '0018', year: '24', cohort: 'July',    dept: deptNames[6]  },
  { firstName: 'Kwadwo',  lastName: 'Gyasi',       idx: '0019', year: '24', cohort: 'January', dept: deptNames[7]  },
  { firstName: 'Ebo',     lastName: 'Danquah',     idx: '0020', year: '24', cohort: 'July',    dept: deptNames[8]  },
  { firstName: 'Ato',     lastName: 'Afriyie',     idx: '0021', year: '24', cohort: 'January', dept: deptNames[9]  },
  { firstName: 'Kodwo',   lastName: 'Amoah',       idx: '0022', year: '24', cohort: 'July',    dept: deptNames[10] },
  { firstName: 'Araba',   lastName: 'Yeboah',      idx: '0023', year: '24', cohort: 'January', dept: deptNames[0]  },
  { firstName: 'Panyin',  lastName: 'Amankwah',    idx: '0024', year: '24', cohort: 'July',    dept: deptNames[1]  },
  { firstName: 'Kakra',   lastName: 'Adjei',       idx: '0025', year: '24', cohort: 'January', dept: deptNames[2]  },
  { firstName: 'Mansa',   lastName: 'Agyei',       idx: '0026', year: '24', cohort: 'July',    dept: deptNames[3]  },
  { firstName: 'Serwa',   lastName: 'Akuffo',      idx: '0027', year: '24', cohort: 'January', dept: deptNames[4]  },
  { firstName: 'Nana',    lastName: 'Wiredu',      idx: '0028', year: '24', cohort: 'July',    dept: deptNames[5]  },
  { firstName: 'Kwaku',   lastName: 'Quaye',       idx: '0029', year: '24', cohort: 'January', dept: deptNames[6]  },
  { firstName: 'Afi',     lastName: 'Tetteh',      idx: '0030', year: '24', cohort: 'July',    dept: deptNames[7]  },
];

const rows = students.map(s => {
  const admYear = parseInt('20' + s.year);
  const programs = departments[s.dept];
  const program = programs[parseInt(s.idx) % 2];
  return [
    `${s.firstName} ${s.lastName}`,
    `UMaT/PG/${s.idx}/${s.year}`,
    `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}${s.idx}@umat.edu.gh`,
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
