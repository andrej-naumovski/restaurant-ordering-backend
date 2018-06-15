import mongoose from 'mongoose'

export const MoneySchema = mongoose.Schema({
  value: String,
  currency: String,
})

export default mongoose.model('Money', MoneySchema)