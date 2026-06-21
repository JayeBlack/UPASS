# Quick Publish Test

Open browser console (F12) and paste this:

```javascript
// Get your token
const token = localStorage.getItem("umat_sps_token");
console.log("Token:", token ? "Found" : "NOT FOUND");

// Test data
const testData = {
  grades: [
    {
      indexNumber: "12345",
      courseName: "Test Course 1",
      marks: 85,
      grade: "A",
      credits: 3
    },
    {
      indexNumber: "kwaku2026",
      courseName: "Test Course 2",
      marks: 90,
      grade: "A",
      credits: 3
    }
  ],
  semester: "Semester 1",
  academicYear: "2026/2027"
};

console.log("Sending:", testData);

// Send request
fetch("http://localhost:5000/api/results/batch-upload", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(testData)
})
.then(res => {
  console.log("Status:", res.status);
  return res.json();
})
.then(data => {
  console.log("Response:", data);
})
.catch(err => {
  console.error("Error:", err);
});
```

Run this in browser console and share what it prints.
