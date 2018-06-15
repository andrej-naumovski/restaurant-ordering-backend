import mongoose from 'mongoose'

import { CategorySchema } from './Category'

export const MenuSchema = mongoose.Schema({
  categories: [CategorySchema]
})

export default mongoose.model('Menu', MenuSchema)