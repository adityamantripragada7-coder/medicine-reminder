import { BellRing, CalendarCheck, CheckCircle2, Clock3, Pill, Plus, ShieldAlert } from 'lucide-react'
import DashboardCard from '../components/DashboardCard'

const today = new Intl.DateTimeFormat('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
}).format(new Date())

function Dashboard({ onNavigate }) {
  const metrics = [
    { label: 'Active medicines', value: 0, icon: Pill, detail: 'Current schedules', tone: 'green' },
    { label: "Today's doses", value: 0, icon: CalendarCheck, detail: 'Scheduled for today', tone: 'blue' },
    { label: 'Taken today', value: 0, icon: CheckCircle2, detail: 'Successfully recorded', tone: 'yellow' },
    { label: 'Pending doses', value: 0, icon: Clock3, detail: 'Still awaiting action', tone: 'orange' },
  ]

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">{today}</p>
          <h1>Good morning</h1>
          <p>Your medication overview will appear here.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => onNavigate('medicines')}>
          <Plus size={18} /> Add medicine
        </button>
      </section>

      <section className="metric-grid" aria-label="Medication overview">
        {metrics.map((metric) => <DashboardCard key={metric.label} {...metric} />)}
      </section>

      <section className="dashboard-grid">
        <article className="panel upcoming-panel">
          <div className="panel__heading">
            <div><span className="section-kicker">NEXT</span><h2>Upcoming reminders</h2></div>
            <BellRing size={20} />
          </div>
          <div className="empty-state">
            <span className="empty-state__icon"><BellRing size={24} /></span>
            <strong>No upcoming reminders</strong>
            <p>Add a medicine to create today's schedule.</p>
            <button className="text-button" type="button" onClick={() => onNavigate('medicines')}>Add a medicine</button>
          </div>
        </article>

        <article className="panel schedule-panel">
          <div className="panel__heading">
            <div><span className="section-kicker">TODAY</span><h2>Medication schedule</h2></div>
            <button className="text-button" type="button" onClick={() => onNavigate('schedule')}>View all</button>
          </div>
          <div className="empty-state empty-state--compact">
            <span className="empty-state__icon"><ShieldAlert size={24} /></span>
            <strong>No doses scheduled</strong>
            <p>Your schedule will be based on saved medicines.</p>
          </div>
        </article>
      </section>
    </>
  )
}

export default Dashboard
