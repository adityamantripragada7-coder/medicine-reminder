const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dosage: { type: Number, required: true, min: 0 },
  dosageUnit: { type: String, required: true, trim: true },
  frequency: { type: String, required: true, trim: true },
  reminderTimes: { type: [{ type: String, match: /^([01]\d|2[0-3]):[0-5]\d$/ }], required: true, validate: [(value) => value.length > 0, 'At least one reminder time is required'] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  instructions: { type: String, required: true, trim: true },
  notes: { type: String, trim: true, default: '' },
  scheduleStatus: { type: String, enum: ['active', 'completed', 'inactive'], default: 'active' }
}, { timestamps: true })

medicineSchema.index({ name: 1 })

module.exports = mongoose.model('Medicine', medicineSchema)
