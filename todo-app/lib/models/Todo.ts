import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const TodoSchema = new Schema(
  {
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

