import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const CommentSchema = new Schema(
  {
    todoId: { type: Schema.Types.ObjectId, ref: 'Todo', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
)

export type CommentDoc = InferSchemaType<typeof CommentSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const CommentModel =
  (mongoose.models.Comment as mongoose.Model<CommentDoc>) ||
  mongoose.model<CommentDoc>('Comment', CommentSchema)
