require('dotenv').config()

const { createApp } = require('./app')
const { initializeDatabase } = require('./config/database')

const PORT = process.env.PORT || 4000

async function startServer() {
  await initializeDatabase()

  const app = createApp()

  app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start backend server:', error)
  process.exit(1)
})
