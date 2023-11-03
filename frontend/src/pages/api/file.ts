// pages/api/readFile.js
import fs from 'fs';
import path from 'path';

export default (req, res) => {
  try {
    // const filePath = path.resolve('./path/to/your/file.txt'); // Replace with the actual file path

    // Read the file content
    const fileContent = fs.readFileSync('C:\Users\HP\Desktop\artblock-chekathon\frontend\public\test.jpg');

    res.status(200).json({ content: fileContent });
  } catch (error) {
    res.status(500).json({ error: 'Error reading the file' });
  }
};
