const express = require('express')
const Medicine = require('../models/Medicine')

const router = express.Router()

router.get('/', async (request, response, next) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 })
    response.json({ success: true, data: medicines })
  } catch (error) { next(error) }
})

router.post('/', async (request, response, next) => {
  try {
    const medicine = await Medicine.create(request.body)
    response.status(201).json({ success: true, data: medicine })
  } catch (error) { next(error) }
})

router.put('/:id', async (request, response, next) => {
  try {
    const allowedFields = ['name', 'dosage', 'dosageUnit', 'frequency', 'reminderTimes', 'startDate', 'endDate', 'instructions', 'notes', 'scheduleStatus']
    const updates = Object.fromEntries(allowedFields.filter((field) => Object.prototype.hasOwnProperty.call(request.body, field)).map((field) => [field, request.body[field]]))

    if (updates.startDate && updates.endDate && new Date(updates.endDate) < new Date(updates.startDate)) {
      return response.status(400).json({ success: false, message: 'End date must be on or after start date' })
    }

    const medicine = await Medicine.findByIdAndUpdate(request.params.id, updates, { new: true, runValidators: true })
    if (!medicine) return response.status(404).json({ success: false, message: 'Medicine not found' })
    response.json({ success: true, data: medicine })
  } catch (error) { next(error) }
})

router.delete('/:id', async (request, response, next) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(request.params.id)
    if (!medicine) return response.status(404).json({ success: false, message: 'Medicine not found' })
    response.json({ success: true, message: 'Medicine deleted' })
  } catch (error) { next(error) }
})

module.exports = router
