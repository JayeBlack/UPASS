// Test publish endpoint directly
// Run: node test_publish.js

const fetch = require('node-fetch');

async function testPublish() {
  const API_URL = 'http://localhost:5000/api';
  
  // You need to get a valid token first
  // Login as exams officer and get the token from localStorage
  const TOKEN = 'YOUR_TOKEN_HERE'; // Replace with actual token
  
  const testData = {
    grades: [
      {
        indexNumber: '12345',
        courseName: 'Test Course',
        marks: 85,
        grade: 'A',
        credits: 3
      },
      {
        indexNumber: 'kwaku2026',
        courseName: 'Test Course',
        marks: 90,
        grade: 'A',
        credits: 3
      }
    ],
    semester: 'Semester 1',
    academicYear: '2024/2025'
  };
  
  console.log('Testing publish endpoint...');
  console.log('Data:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch(`${API_URL}/results/batch-upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Status:', response.status);
    
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ SUCCESS!');
    } else {
      console.log('❌ FAILED');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

console.log('To use this test:');
console.log('1. Login as Exams Officer in browser');
console.log('2. Open console (F12)');
console.log('3. Type: localStorage.getItem("umat_sps_token")');
console.log('4. Copy the token');
console.log('5. Replace TOKEN in this file');
console.log('6. Run: node test_publish.js');
console.log();

// testPublish();
