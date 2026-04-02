const Message = require("../Models/message");
const Conversation = require("../Models/conversation");

const messagecontroller = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: reciverID } = req.params;
    const senderId = req.user._id;

    let chat = await Conversation.findOne({
      participants: { $all: [senderId, reciverID] },
    });

    if (!chat) {
      chat = await Conversation.create({
        participants: [senderId, reciverID],
      });
    }

    const newMessage = new Message({
      senderId,
      reciverID,
      message,
      conversationId: chat._id,
    });

    await newMessage.save();
    chat.messages.push(newMessage._id);
    await chat.save();

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = messagecontroller;
