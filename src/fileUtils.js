const fs = require('fs');
const path = require('path');

// Function to read all .txt files from the wordlists directory
const getWordlistFiles = (dirPath) => {
  return fs.readdirSync(dirPath).filter(file => path.extname(file) === '.txt');
};

// Function to read all values from a wordlist file
const getWordlistValues = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
};

module.exports = {
  getWordlistFiles,
  getWordlistValues,
};
