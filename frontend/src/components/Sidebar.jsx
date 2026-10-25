import { CalendarDays, Clock3, History, LayoutDashboard, Pill, Settings, X } from 'lucide-react'

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'medicines', label: 'My Medicines', icon: Pill },
  { id: 'schedule', label: "Today's Schedule", icon: CalendarDays },
  { id: 'history', label: 'Medication History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand-row">
        <div className="sidebar__brand">
          <span className="brand-mark"><Pill size={20} /></span>
          <span>MedTrack</span>
        </div>
        <button className="icon-button sidebar__close" onClick={onClose} aria-label="Close navigation">
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        <span className="sidebar__label">MENU</span>
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`nav-item ${activePage === id ? 'nav-item--active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__reminder">
        <Clock3 size={18} />
        <div>
          <strong>Reminder center</strong>
          <span>Browser alerts available</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
