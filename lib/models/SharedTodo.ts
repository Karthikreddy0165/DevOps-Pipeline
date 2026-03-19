import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const SharedTodoSchema = new Schema(
  {
    todoId: { type: Schema.Types.ObjectId, ref: 'Todo', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sharedWithEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    sharedWithUserId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

SharedTodoSchema.index({ todoId: 1, sharedWithEmail: 1 }, { unique: true })

export type SharedTodoDoc = InferSchemaType<typeof SharedTodoSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const SharedTodoModel =
  (mongoose.models.SharedTodo as mongoose.Model<SharedTodoDoc>) ||
  mongoose.model<SharedTodoDoc>('SharedTodo', SharedTodoSchema)
