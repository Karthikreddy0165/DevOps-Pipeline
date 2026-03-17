import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const CategorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    color: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

// Compound index for userId + id uniqueness
CategorySchema.index({ userId: 1, id: 1 }, { unique: true })

export type CategoryDoc = InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const CategoryModel =
  (mongoose.models.Category as mongoose.Model<CategoryDoc>) ||
  mongoose.model<CategoryDoc>('Category', CategorySchema)

