import 'babel-polyfill'

import express from 'express'
import winston from 'winston'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'

import * as config from './config'

// Routes
import baseRouter from './controllers'

/*
  Create Express app
 */
const app = express()

/*
  Add morgan for request logging
 */
app.use(morgan())

/*
  Add logfile to Winston
 */
winston.add(winston.transports.File, {
  filename: 'logs/server.log'
})

/*
  Connect Mongoose to database
 */
mongoose.connect(config.databaseUrl, {
  useMongoClient: true
})

/*
  Add middleware for parsing JSON and URLEncoded forms
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*
  Add module routes to Express app
 */
app.use('/api', baseRouter)

/*
  Get port from process or use 5000 if nonexistent
 */
const port = process.env.PORT || 5000

/*
  Start listening for requests
 */
app.listen(port, () => {
  winston.info(`ConnectUs API listening on port ${port}`)
})