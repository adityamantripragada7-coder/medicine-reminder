import { useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import PlaceholderPage from './pages/PlaceholderPage'
import './App.css'

const pageCopy = {
  medicines: ['My medicines', 'Create, review, and manage your medication schedules.'],
  schedule: ["Today's schedule", 'Review and record the doses scheduled for today.'],
  history: ['Medication history', 'Review past doses and adherence activity.'],
  settings: ['Settings', 'Manage reminder and application preferences.'],
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    if (activePage === 'dashboard') return <Dashboard onNavigate={navigate} />
    const [title, description] = pageCopy[activePage]
    return <PlaceholderPage title={title} description={description} />
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={navigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
            <Menu size={22} />
          </button>
          <div className="topbar__actions">
            <button className="icon-button notification-button" type="button" aria-label="Notifications">
              <Bell size={20} /><span className="notification-dot" />
            </button>
            <div className="profile-chip"><span>JD</span><div><strong>John Doe</strong><small>Personal account</small></div></div>
          </div>
        </header>
        <div className="page-content">{renderPage()}</div>
      </main>
    </div>
  )
}

export default App
