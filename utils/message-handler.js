// utils/message-handler.js
import Message from '../models/message-model.js';

export const handleChatEvents = (socket, io) => {
  console.log('🔌 Chat user connected:', socket.id);

  /** Join a room */
  socket.on('joinRoom', (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`📥 User ${socket.id} joined room: ${roomId}`);

    // Notify others (optional)
    socket.to(roomId).emit('userJoined', { socketId: socket.id, roomId });
  });

  /**
   * Send a message
   * payload: { roomId, senderId, receiverId, text }
   */
  socket.on('sendMessage', async (payload) => {
    try {
      const { roomId, senderId, receiverId, text } = payload || {};
      if (!roomId || !senderId || !receiverId || !text?.trim()) {
        return; // invalid payload
      }

      // Persist with default status "sent"
      const newMessage = await Message.create({
        roomId,
        senderId,
        receiverId,
        text: text.trim(),
        status: 'sent',
        timestamp: new Date(),
      });

      // Emit to room: message created
      io.to(roomId).emit('receiveMessage', newMessage);

      // Immediately mark as "delivered" for everyone currently in room
      // (Optional: check if receiver socket is present in room)
      const updated = await Message.findByIdAndUpdate(
        newMessage.id,
        { $set: { status: 'delivered' } },
        { new: true }
      ).lean();

      io.to(roomId).emit('messageDelivered', { messageId: updated.id, roomId });
    } catch (err) {
      console.error('❌ Error saving message:', err);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  /**
   * Mark message as read
   * payload: { roomId, messageId, readerId }
   */
  socket.on('markRead', async ({ roomId, messageId, readerId }) => {
    try {
      if (!roomId || !messageId || !readerId) return;
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { $set: { status: 'read', readAt: new Date() } },
        { new: true }
      ).lean();

      if (updated) {
        io.to(roomId).emit('messageRead', {
          messageId: updated.id,
          readAt: updated.readAt,
          roomId,
          readerId,
        });
      }
    } catch (err) {
      console.error('❌ Error marking read:', err);
    }
  });

  /**
   * Typing indicator
   * payload: { roomId, userId, isTyping: boolean }
   */
  socket.on('typing', ({ roomId, userId, isTyping }) => {
    if (!roomId || !userId) return;
    socket
      .to(roomId)
      .emit('userTyping', { roomId, userId, isTyping: !!isTyping });
  });

  socket.on('disconnect', () => {
    console.log('❌ Chat user disconnected:', socket.id);
  });
};
