const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Giả định ID người dùng hiện tại (Trong thực tế sẽ lấy từ Token/Session)
const CURRENT_USER_ID = "user123"; 

// ROUTER 1: GET "/:userID" - Lấy hội thoại 2 chiều
router.get('/:userID', async (req, res) => {
    try {
        const targetID = req.params.userID;
        const messages = await Message.find({
            $or: [
                { from: CURRENT_USER_ID, to: targetID },
                { from: targetID, to: CURRENT_USER_ID }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ROUTER 2: POST "/" - Gửi tin nhắn (Tự động nhận diện file/text)
router.post('/', async (req, res) => {
    try {
        const { to, text, isFilePath } = req.body; 
        // isFilePath: bạn gửi kèm từ Postman để báo đây là đường dẫn file
        
        const newMessage = new Message({
            from: CURRENT_USER_ID,
            to: to,
            messageContent: {
                type: isFilePath ? 'file' : 'text',
                text: text
            }
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ROUTER 3: GET "/" - Lấy tin nhắn cuối cùng của mỗi người
router.get('/', async (req, res) => {
    try {
        const messages = await Message.aggregate([
            { $match: { $or: [{ from: CURRENT_USER_ID }, { to: CURRENT_USER_ID }] } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $gt: ["$from", "$to"] },
                            { p1: "$from", p2: "$to" },
                            { p1: "$to", p2: "$from" }
                        ]
                    },
                    lastMsg: { $first: "$$ROOT" }
                }
            }
        ]);
        res.json(messages.map(m => m.lastMsg));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;