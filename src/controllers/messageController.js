import db from "../../config/database.js";

const messages = db.data.messages;

const getMessages = (req, res) => {
  res.status(200).send({ messages: messages });
};

const createMessage = async (req, res) => {
  const { message, date, userId, channelId } = req.body;
  if (!message) {
    return res.status(400).json({ status: 'failed', error: 'Please provide a message' });
  }

  try {
    const newMessage = {
      messageId: messages.length + 1,
      messageText: message,
      date: date,
      userId: userId,
      channelId: channelId,
    };
    messages.push(newMessage);
    await db.write();

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failed', error: 'An error occurred while creating the message' });
  }
};
export default { getMessages, createMessage };