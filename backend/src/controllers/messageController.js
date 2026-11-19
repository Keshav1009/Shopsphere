const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Get messages for a given reference (Product ID or Project ID)
const getMessagesByReference = async (req, res, next) => {
  try {
    const { referenceId } = req.params;

    const messages = await db.allAsync(`
      SELECT m.*, u.name as sender_name, u.role as sender_role, u.tech_stack as sender_tech_stack
      FROM connections_messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.reference_id = ?
      ORDER BY m.timestamp ASC
    `, [referenceId]);

    const formatted = messages.map(m => {
      try {
        m.sender_tech_stack = JSON.parse(m.sender_tech_stack || '[]');
      } catch {
        m.sender_tech_stack = [];
      }
      return m;
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      messages: formatted
    });
  } catch (error) {
    next(error);
  }
};

// Post a new message to a thread
const sendMessage = async (req, res, next) => {
  try {
    const { reference_id, receiver_id = null, message_text } = req.body;
    const sender_id = req.user.id;

    if (!reference_id || !message_text || !message_text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reference ID and message text are required.'
      });
    }

    const id = `msg_${uuidv4().substring(0, 8)}`;
    await db.runAsync(`
      INSERT INTO connections_messages (id, sender_id, receiver_id, reference_id, message_text)
      VALUES (?, ?, ?, ?, ?)
    `, [id, sender_id, receiver_id, reference_id, message_text.trim()]);

    const created = await db.getAsync(`
      SELECT m.*, u.name as sender_name, u.role as sender_role
      FROM connections_messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `, [id]);

    return res.status(201).json({
      success: true,
      message: 'Message delivered successfully.',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessagesByReference,
  sendMessage
};
