const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDatabase = require('./config/db')
const medicineRoutes = require('./routes/medicineRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok', service: 'medicine-reminder-api' })
})
app.use('/api/medicines', medicineRoutes)
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Medicine Reminder API running on port ${PORT}`)
})

connectDatabase().catch((error) => {
  console.error(`MongoDB connection failed: ${error.message}`)
})
