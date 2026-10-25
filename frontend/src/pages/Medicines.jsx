import { useEffect, useState } from 'react'
import { Edit3, Plus, Search, Trash2, X } from 'lucide-react'
import { medicinesApi } from '../services/api'

const emptyForm = {
  name: '', dosage: '', dosageUnit: 'Tablet', frequency: 'Once daily', reminderTimes: ['09:00'],
  startDate: '', endDate: '', instructions: '', notes: '', scheduleStatus: 'active'
}

function Medicines() {
  const [medicines, setMedicines] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadMedicines() {
    setError('')
    try {
      const result = await medicinesApi.list()
      setMedicines(result.data)
    } catch (requestError) { setError(requestError.message) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    let active = true
    medicinesApi.list()
      .then((result) => { if (active) setMedicines(result.data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setFormOpen(true)
    setError('')
  }

  function openEdit(medicine) {
    setForm({ ...medicine, dosage: String(medicine.dosage), startDate: medicine.startDate.slice(0, 10), endDate: medicine.endDate.slice(0, 10), reminderTimes: [...medicine.reminderTimes] })
    setEditingId(medicine._id)
    setFormOpen(true)
    setError('')
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function updateReminder(index, value) {
    setForm((current) => ({ ...current, reminderTimes: current.reminderTimes.map((time, position) => position === index ? value : time) }))
  }

  async function saveMedicine(event) {
    event.preventDefault()
    if (saving) return
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date must be on or after start date.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        dosage: Number(form.dosage),
        dosageUnit: form.dosageUnit,
        frequency: form.frequency,
        reminderTimes: form.reminderTimes.filter(Boolean),
        startDate: form.startDate,
        endDate: form.endDate,
        instructions: form.instructions.trim(),
        notes: form.notes.trim(),
        scheduleStatus: form.scheduleStatus || 'active'
      }
      if (editingId) await medicinesApi.update(editingId, payload)
      else await medicinesApi.create(payload)
      setNotice(editingId ? 'Medicine updated.' : 'Medicine added.')
      setFormOpen(false)
      await loadMedicines()
    } catch (requestError) { setError(requestError.message) }
    finally { setSaving(false) }
  }

  async function deleteMedicine(medicine) {
    if (!window.confirm(`Delete ${medicine.name}?`)) return
    try {
      await medicinesApi.remove(medicine._id)
      setNotice('Medicine deleted.')
      await loadMedicines()
    } catch (requestError) { setError(requestError.message) }
  }

  const filteredMedicines = medicines.filter((medicine) => medicine.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <section>
      <div className="page-heading">
        <div><h1>My medicines</h1><p>Create, review, and manage your medication schedules.</p></div>
        <button className="primary-button" type="button" onClick={openCreate}><Plus size={18} /> Add medicine</button>
      </div>

      {notice && <div className="notice" role="status">{notice}<button type="button" onClick={() => setNotice('')}><X size={16} /></button></div>}
      {error && <div className="error-message">{error}</div>}

      <div className="medicine-toolbar">
        <label className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search medicines" /></label>
      </div>

      {loading ? <div className="panel placeholder-panel">Loading medicines...</div> : filteredMedicines.length === 0 ? (
        <div className="panel placeholder-panel"><strong>No medicines found</strong><p>Add your first medicine to create a schedule.</p></div>
      ) : (
        <div className="medicine-list">
          {filteredMedicines.map((medicine) => (
            <article className="medicine-row" key={medicine._id}>
              <div className="medicine-avatar"><span>{medicine.name.charAt(0).toUpperCase()}</span></div>
              <div className="medicine-main"><strong>{medicine.name}</strong><span>{medicine.dosage} {medicine.dosageUnit} · {medicine.frequency}</span></div>
              <div className="medicine-times"><strong>{medicine.reminderTimes.join(', ')}</strong><span>{new Date(medicine.startDate).toLocaleDateString()} – {new Date(medicine.endDate).toLocaleDateString()}</span></div>
              <span className={`status-pill status-pill--${medicine.scheduleStatus}`}>{medicine.scheduleStatus}</span>
              <div className="row-actions"><button className="icon-button" type="button" onClick={() => openEdit(medicine)} aria-label={`Edit ${medicine.name}`}><Edit3 size={17} /></button><button className="icon-button delete-button" type="button" onClick={() => deleteMedicine(medicine)} aria-label={`Delete ${medicine.name}`}><Trash2 size={17} /></button></div>
            </article>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false) }}>
          <form className="medicine-modal" onSubmit={saveMedicine}>
            <div className="modal-heading"><div><span className="section-kicker">MEDICATION</span><h2>{editingId ? 'Edit medicine' : 'Add medicine'}</h2></div><button className="icon-button" type="button" onClick={() => setFormOpen(false)} aria-label="Close"><X size={20} /></button></div>
            <div className="form-grid">
              <label className="field field--wide">Medicine name<input name="name" value={form.name} onChange={updateField} required /></label>
              <label className="field">Dosage<input name="dosage" type="number" min="0" step="0.25" value={form.dosage} onChange={updateField} required /></label>
              <label className="field">Unit<select name="dosageUnit" value={form.dosageUnit} onChange={updateField}><option>Tablet</option><option>Capsule</option><option>mL</option><option>mg</option><option>Drop</option></select></label>
              <label className="field field--wide">Frequency<select name="frequency" value={form.frequency} onChange={updateField}><option>Once daily</option><option>Twice daily</option><option>Three times daily</option><option>As directed</option></select></label>
              <div className="field field--wide"><span>Reminder time</span>{form.reminderTimes.map((time, index) => <input key={index} type="time" value={time} onChange={(event) => updateReminder(index, event.target.value)} required />)}<button className="text-button" type="button" onClick={() => setForm((current) => ({ ...current, reminderTimes: [...current.reminderTimes, '12:00'] }))}>Add another time</button></div>
              <label className="field">Start date<input name="startDate" type="date" value={form.startDate} onChange={updateField} required /></label>
              <label className="field">End date<input name="endDate" type="date" value={form.endDate} onChange={updateField} required /></label>
              <label className="field field--wide">Instructions<textarea name="instructions" value={form.instructions} onChange={updateField} required /></label>
              <label className="field field--wide">Notes<textarea name="notes" value={form.notes || ''} onChange={updateField} /></label>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setFormOpen(false)}>Cancel</button><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add medicine'}</button></div>
          </form>
        </div>
      )}
    </section>
  )
}

export default Medicines
