import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const SubtaskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
}, { _id: false })

const TodoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },
    completed: { type: Boolean, default: false, index: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    category: { type: String, required: true, index: true },
    dueDate: { type: Date },
    tags: { type: [String], default: [], index: true },
    // New fields
    subtasks: { type: [SubtaskSchema], default: [] },
    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekdays', 'weekly', 'monthly'],
      default: 'none',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
      index: true,
    },
    order: { type: Number, default: 0 },
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true }
)

TodoSchema.index({ title: 'text', description: 'text', tags: 'text' })

export type TodoDoc = InferSchemaType<typeof TodoSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const TodoModel =
  (mongoose.models.Todo as mongoose.Model<TodoDoc>) ||
  mongoose.model<TodoDoc>('Todo', TodoSchema)
