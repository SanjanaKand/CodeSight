interface HeaderProps {
  language: string
  onLanguageChange: (language: string) => void
  onRun: () => void
}

function Header({
  language,
  onLanguageChange,
  onRun,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="logo">
        CodeSight
      </div>

      <div className="header-actions">
        <select
          className="language-select"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button
          className="run-button"
          onClick={onRun}
        >
          ▶ Run
        </button>
      </div>
    </header>
  )
}

export default Header