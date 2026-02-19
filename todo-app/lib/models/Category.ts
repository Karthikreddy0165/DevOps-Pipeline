import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const CategorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    color: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

export type CategoryDoc = InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const CategoryModel =
  (mongoose.models.Category as mongoose.Model<CategoryDoc>) ||
  mongoose.model<CategoryDoc>('Category', CategorySchema)

