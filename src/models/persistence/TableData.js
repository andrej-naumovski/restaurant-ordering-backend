import mongoose from 'mongoose'

export const TableDataSchema = mongoose.Schema({
  tableNumber: Number,
  isAvailable: Boolean,
  employeeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee'
  },
})

export default mongoose.model('TableData', TableDataSchema)