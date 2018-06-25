import mongoose from 'mongoose'

// Subdocument schemas
import { TableDataSchema } from './TableData'
import { EmployeeSchema } from './Employee'
import { MenuSchema } from './Menu'
import { LatLngSchema } from './LatLng'

export const RestaurantSchema = mongoose.Schema({
  name: String,
  tables: [TableDataSchema],
  employees: [EmployeeSchema],
  menu: MenuSchema,
  location: LatLngSchema,
}, {
  usePushEach: true,
})

export default mongoose.model('Restaurant', RestaurantSchema)
