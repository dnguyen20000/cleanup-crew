export default function Header({ title, sub, left, right }) {
  return (
    <header className="header">
      <div className="row" style={{ gap: 12 }}>
        {left}
        <div>
          <h1>{title}</h1>
          {sub && <div className="sub">{sub}</div>}
        </div>
      </div>
      {right}
    </header>
  )
}
