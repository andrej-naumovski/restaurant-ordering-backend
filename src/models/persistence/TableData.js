import mongoose from 'mongoose'

export const TableDataSchema = mongoose.Schema({
  tableNumber: Number,
  isAvailable: Boolean,
  employeeId: String,
})