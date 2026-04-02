const Conversation = require("../Models/conversation");
const User = require("../Models/user");

const getCurrentChatters = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentChatters = await Conversation.find({
      participants: currentUserId,
    }).sort({ updatedAt: -1 });

    if (!currentChatters.length) return res.status(200).send({
      message:"start converstion with them"
    });

    const participantsIDs = currentChatters.reduce((ids, conversation) => {
      const others = conversation.participants.filter(
        (id) => id.toString() !== currentUserId.toString(),
      );
      return [...ids, ...others];
    }, []);

    const users = await User.find({ _id: { $in: participantsIDs } }).select(
      "-password -email",
    );

    // Map users with their conversation IDs
    const usersWithConversations = users.map((user) => {
      const conversation = currentChatters.find((conv) =>
        conv.participants.some((id) => id.toString() === user._id.toString())
      );
      return {
        ...user.toObject(),
        conversationId: conversation?._id,
      };
    });

    res.status(200).send(usersWithConversations);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = getCurrentChatters;
