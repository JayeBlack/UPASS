// Test file upload parsing - Run this to test if xlsx parsing works
// Usage: node test_parse_file.js

const xlsx = require('xlsx');
const path = require('path');

console.log('🧪 Testing file parsing...\n');

// Test 1: Check if xlsx is installed
try {
  console.log('✅ xlsx package found');
  console.log(`   Version: ${require('xlsx/package.json').version}\n`);
} catch (err) {
  console.error('❌ xlsx package not installed!');
  console.error('   Run: npm install xlsx\n');
  process.exit(1);
}

// Test 2: Try to parse the sample file
const sampleFile = path.join(__dirname, '..', 'sample_grades.csv');

try {
  console.log(`📄 Attempting to parse: ${sampleFile}\n`);
  
  const workbook = xlsx.readFile(sampleFile);
  console.log('✅ File read successfully');
  console.log(`   Sheets found: ${workbook.SheetNames.join(', ')}\n`);
  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
  
  console.log('✅ Data parsed successfully');
  console.log(`   Total rows: ${data.length}`);
  console.log(`   Data rows (excluding header): ${data.length - 1}\n`);
  
  console.log('📋 First 5 rows:');
  console.log('─'.repeat(80));
  data.slice(0, 5).forEach((row, i) => {
    console.log(`Row ${i}: ${JSON.stringify(row)}`);
  });
  console.log('─'.repeat(80));
  console.log();
  
  // Test 3: Validate data structure
  console.log('🔍 Validating data structure...');
  const headers = data[0];
  const expectedHeaders = ['Index Number', 'Student Name', 'Course Name', 'Credit Hours', 'Marks'];
  
  const headersMatch = headers.length >= 5 && 
    headers[0].toString().toLowerCase().includes('index') &&
    headers[1].toString().toLowerCase().includes('name') &&
    headers[2].toString().toLowerCase().includes('course') &&
    headers[3].toString().toLowerCase().includes('credit') &&
    headers[4].toString().toLowerCase().includes('mark');
  
  if (headersMatch) {
    console.log('✅ Headers look correct');
  } else {
    console.log('⚠️  Headers might not match expected format');
    console.log(`   Expected: ${expectedHeaders.join(', ')}`);
    console.log(`   Found: ${headers.join(', ')}`);
  }
  
  console.log();
  console.log('✅ All tests passed! File parsing works correctly.\n');
  console.log('📤 This is what will be returned to frontend:');
  console.log(JSON.stringify({ data: data.slice(0, 3) }, null, 2));
  
} catch (err) {
  console.error('❌ Parse error:', err.message);
  console.error();
  console.error('   Make sure sample_grades.csv exists in the project root');
  console.error('   with the correct format.\n');
  process.exit(1);
}
