const databaseUrl = process.env.NODE_ENV === 'prod' ?
  'mongodb://172.17.0.3:27017/restaurant-ordering' :
  'mongodb://localhost:27017/restaurant-ordering'

export {
  databaseUrl
}