const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true }, // ID người gửi
    to: { type: String, required: true },   // ID người nhận
    messageContent: {
        type: { type: String, enum: ['file', 'text'], required: true },
        text: { type: String, required: true } // Nếu là file thì đây là path, nếu là text thì là nội dung
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);