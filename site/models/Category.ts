import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICategory extends Document {
  mlId:        string
  name:        string
  slug:        string
  parentMlId:  string | null
  level:       number
  path:        string[]
  childrenIds: string[]
  totalItems:  number
  active:      boolean
  createdAt:   Date
  updatedAt:   Date
}

const CategorySchema = new Schema<ICategory>(
  {
    mlId:        { type: String, required: true, unique: true, index: true },
    name:        { type: String, required: true },
    slug:        { type: String, required: true, index: true },
    parentMlId:  { type: String, default: null, index: true },
    level:       { type: Number, required: true, default: 0 },
    path:        { type: [String], required: true, default: [] },
    childrenIds: { type: [String], default: [] },
    totalItems:  { type: Number, default: 0 },
    active:      { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'categories',
  }
)

export const Category: Model<ICategory> =
  (mongoose.models.Category as Model<ICategory>) ??
  mongoose.model<ICategory>('Category', CategorySchema)
