import mongoose from 'mongoose'

import { TableDataSchema } from './TableData'

export const EmployeeSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  socialSecurityNumber: String,
  password: String,
  tables: [TableDataSchema],
})

export default mongoose.model('Employee', EmployeeSchema)