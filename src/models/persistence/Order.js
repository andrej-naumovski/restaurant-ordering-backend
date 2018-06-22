import mongoose from 'mongoose'

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
  }]
})

export default mongoose.model('Order', OrderSchema)
