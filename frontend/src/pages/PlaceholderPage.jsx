function PlaceholderPage({ title, description }) {
  return (
    <section>
      <div className="page-heading page-heading--single">
        <div><h1>{title}</h1><p>{description}</p></div>
      </div>
      <article className="panel placeholder-panel">
        <strong>This section is ready for the next phase.</strong>
        <p>Your saved data will appear here once the connected API is implemented.</p>
      </article>
    </section>
  )
}

export default PlaceholderPage
