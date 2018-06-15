import mongoose from 'mongoose'

import { MoneySchema } from '../domain/Money'

export const MenuItemSchema = mongoose.Schema({
  name: String,
  category: String,
  price: MoneySchema,
  quantity: Number,
  quantityType: String,
})

export default mongoose.model('MenuItem', MenuItemSchema)
