import mongoose from 'mongoose'

import { MoneySchema } from './Money'

export const MenuItemSchema = mongoose.Schema({
  name: String,
  price: MoneySchema,
  quantity: Number,
  quantityType: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
})

export default mongoose.model('MenuItem', MenuItemSchema)
