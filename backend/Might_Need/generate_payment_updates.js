const XLSX = require('xlsx');
const path = require('path');

const updates = [
  {
    'Index Number': 'UMaT/PG/0003/22',
    'Total Amount': 8000,
    'Amount Paid': 3000,       // exact outstanding — clears fee
    'Academic Year': '2024/2025',
    'Semester': 'First',
    'Note': 'Pays exact outstanding GHS 3,000 — fee fully cleared'
  },
  {
    'Index Number': 'UMaT/PG/0008/22',
    'Total Amount': 8000,
    'Amount Paid': 3000,       // exact outstanding — clears fee
    'Academic Year': '2024/2025',
    'Semester': 'First',
    'Note': 'Pays exact outstanding GHS 3,000 — fee fully cleared'
  },
  {
    'Index Number': 'UMaT/PG/0009/22',
    'Total Amount': 8000,
    'Amount Paid': 4000,       // 3000 outstanding + 1000 extra = GHS 1000 credit
    'Academic Year': '2024/2025',
    'Semester': 'First',
    'Note': 'Overpays by GHS 1,000 — creates credit balance'
  },
  {
    'Index Number': 'UMaT/PG/0015/22',
    'Total Amount': 8000,
    'Amount Paid': 4000,       // 3000 outstanding + 1000 extra = GHS 1000 credit
    'Academic Year': '2024/2025',
    'Semester': 'First',
    'Note': 'Overpays by GHS 1,000 — creates credit balance'
  },
];

const ws = XLSX.utils.json_to_sheet(updates);
ws['!cols'] = [
  { wch: 20 }, { wch: 15 }, { wch: 15 },
  { wch: 15 }, { wch: 12 }, { wch: 55 },
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Payment Updates');

const filePath = path.join(__dirname, '..', 'excel-files', 'sample_payment_updates.xlsx');
XLSX.writeFile(wb, filePath);

console.log('✅ Generated sample_payment_updates.xlsx');
console.log('   UMaT/PG/0003/22 → pays GHS 3,000 → fully cleared');
console.log('   UMaT/PG/0008/22 → pays GHS 3,000 → fully cleared');
console.log('   UMaT/PG/0009/22 → pays GHS 4,000 → GHS 1,000 credit balance');
console.log('   UMaT/PG/0015/22 → pays GHS 4,000 → GHS 1,000 credit balance');
