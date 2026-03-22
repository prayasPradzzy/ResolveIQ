const express = require('express')
const cors = require('cors')
const apiRoutes = require('./routes')
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler')

function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(apiRoutes)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

module.exports = { createApp }
