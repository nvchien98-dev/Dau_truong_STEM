const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Set up multer for file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Gemini Pro
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCAbD9gNnZlT8tdtf8BuH4ytfGGQUuJJmQ'); // Fallback to provided key if dotenv fails
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use latest pro model

const SYSTEM_PROMPT = `Bạn là Chỉ huy C-seed, một NPC hướng dẫn lập trình cho thiếu nhi.
Hãy đóng vai trò người hướng dẫn gợi mở (Socratic Tutor).
Đọc nội dung file mã nguồn học sinh nộp (Python hoặc Scratch project.json), tìm lỗi sai logic và đặt câu hỏi gợi mở, tuyệt đối không đưa code giải sẵn.
Sau khi nhận xét, hãy tính điểm thưởng E_bonus dựa trên độ sạch của code (từ 10 đến 50 điểm) dựa theo cách học sinh tổ chức logic, thụt lề, tên biến.
Trả về dữ liệu dưới định dạng JSON với cấu trúc:
{
  "feedback": "Nhận xét gợi mở của bạn...",
  "e_bonus": <điểm số nguyên>
}`;

app.post('/api/mentor/analyze', upload.single('codeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng đính kèm file code (.py hoặc .sb3).' });
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let codeContent = '';

    if (fileExt === '.py') {
      codeContent = req.file.buffer.toString('utf-8');
    } else if (fileExt === '.sb3') {
      try {
        const zip = new AdmZip(req.file.buffer);
        const zipEntries = zip.getEntries();
        const projectJsonEntry = zipEntries.find(entry => entry.entryName === 'project.json');
        
        if (projectJsonEntry) {
          codeContent = projectJsonEntry.getData().toString('utf-8');
        } else {
          return res.status(400).json({ error: 'File .sb3 không hợp lệ (thiếu project.json).' });
        }
      } catch (err) {
        console.error('Error extracting sb3:', err);
        return res.status(400).json({ error: 'Không thể giải nén file .sb3.' });
      }
    } else {
      return res.status(400).json({ error: 'Định dạng file không hỗ trợ. Vui lòng nộp .py hoặc .sb3' });
    }

    // Call Gemini
    const prompt = `
${SYSTEM_PROMPT}

Dưới đây là mã nguồn của học sinh:
${codeContent.substring(0, 50000)} // Giới hạn một phần dữ liệu nếu quá lớn
`;

    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text();
    
    // Clean up response if it contains markdown formatting for json
    aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsedResponse = JSON.parse(aiResponse);
      res.json(parsedResponse);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', aiResponse);
      // Fallback
      res.json({
        feedback: aiResponse,
        e_bonus: 10
      });
    }

  } catch (error) {
    console.error('Mentor Analysis Error:', error);
    res.status(500).json({ error: 'Hệ thống Chỉ huy C-seed đang bận. Vui lòng thử lại sau.' });
  }
});

app.listen(port, () => {
  console.log(`STEM Arena Backend (AI Mentor) listening on port ${port}`);
});
