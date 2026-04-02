const conversation = require("../Models/conversation");

const getmessage = async (req, res) => {
  try {
    const { id } = req.params;
    const senderId = req.user._id;

    // Try to get by conversation ID first
    let chats = await conversation
      .findById(id)
      .populate("messages");

    // If no result, try the old way (by receiver ID)
    if (!chats) {
      chats = await conversation
        .findOne({
          participants: { $all: [senderId, id] },
        })
        .populate("messages");
    }

    if (!chats) return res.status(200).send([]);
    const message = chats.messages;
    res.status(200).send(message);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = getmessage;