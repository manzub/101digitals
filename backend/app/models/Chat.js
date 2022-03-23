const mongoose = require('mongoose');

const Chat = mongoose.model("Chat", new mongoose.Schema({
  roomId: { type: String, required: true },
  chats: { type: Array }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }))

module.exports = Chat;