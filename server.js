const express = require('express');
const mongoose = require('mongoose'); // CHỈ GIỮ LẠI 1 DÒNG NÀY
const messageRoutes = require('./routes/messageRoutes');

const app = express();
app.use(express.json());

// Kết nối tới MongoDB trên Docker
const mongoURI = 'mongodb://127.0.0.1:27017/chatDB'; 

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Đã kết nối thành công tới MongoDB trên Docker!"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));

app.use('/messages', messageRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`));