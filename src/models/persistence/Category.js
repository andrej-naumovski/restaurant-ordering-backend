import mongoose from 'mongoose'

import { MenuItemSchema } from './MenuItem'

export const CategorySchema = mongoose.Schema({
  name: String,
  items: [MenuItemSchema]
})

export default mongoose.model('Category', CategorySchema)