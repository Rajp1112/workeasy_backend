// models/message-model.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    senderId: { type: String, required: true, index: true },
    receiverId: { type: String, required: true, index: true },

    text: { type: String, required: true },

    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
      index: true,
    },

    timestamp: { type: Date, default: Date.now },

    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

messageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
messageSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
