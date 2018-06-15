import mongoose from 'mongoose'

export const TableDataSchema = mongoose.Schema({
  tableNumber: Number,
  isAvailable: Boolean,
  employeeId: String,
})

export default mongoose.model('TableData', TableDataSchema)