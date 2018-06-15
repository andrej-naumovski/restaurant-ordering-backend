import mongoose from 'mongoose'

export const LatLngSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
})

export default mongoose.model('LatLng', LatLngSchema)
