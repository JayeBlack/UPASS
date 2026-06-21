const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'controllers', 'studentController.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the getAll function
const oldPattern = /\/\/ GET \/api\/students\s*\nexports\.getAll = async \(req, res\) => \{[\s\S]*?try \{[\s\S]*?const \{ department, status, search \} = req\.query;/;

const newCode = `// GET /api/students
exports.getAll = async (req, res) => {
  try {
    const { department, status, search, page = '1', limit = '1000' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    const { department, status, search } = req.query;`;

if (oldPattern.test(content)) {
  content = content.replace(oldPattern, newCode);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated studentController.js with pagination');
} else {
  console.log('❌ Pattern not found, file unchanged');
}
