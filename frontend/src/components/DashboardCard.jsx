function DashboardCard({ icon: Icon, label, value, tone = 'green', detail }) {
  return (
    <article className="dashboard-card">
      <div className={`metric-icon metric-icon--${tone}`}><Icon size={22} /></div>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </article>
  )
}

export default DashboardCard
