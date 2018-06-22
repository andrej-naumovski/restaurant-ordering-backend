import mongoose from 'mongoose'

import { MoneySchema } from './Money'

const OrderSchema = mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TableData'
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
  }],
  isCompleted: Boolean,
  totalValue: MoneySchema,
})

export default mongoose.model('Order', OrderSchema)
