const databaseUrl = process.env.NODE_ENV === 'prod' ?
  'mongodb://172.17.0.3:27017/connect-us' :
  'mongodb://localhost:27017/connect-us'

export {
  databaseUrl
}