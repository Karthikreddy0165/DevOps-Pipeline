import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{ type: String }], // emails of people who can see/edit this
    notes: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    reminderTime: { type: Date }, // Specific date/time for the reminder
  },
  { timestamps: true },
);

export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema);
