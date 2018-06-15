import mongoose from 'mongoose'

import { TableDataSchema } from './TableData'
import { EmployeeSchema } from './Employee'
import { MenuSchema } from './Menu'

export const RestaurantSchema = mongoose.Schema({
  name: String,
  tables: [TableDataSchema],
  employees: [EmployeeSchema],
  menu: MenuSchema
})

export default mongoose.model('Restaurant', RestaurantSchema)
