import React, { useEffect, useState } from 'react'

export default function Header() {
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    fetch('/api/theme')
      .then((res) => res.json())
      .then((data) => setTheme(data))
      .catch(() => {
        // Fallback to local config file if API is not available
        import('../../../theme/config.json').then((m) => setTheme(m))
      })
  }, [])

  const menuItems = (theme && theme.menu) || []

  return (
    <header id="header-main" className="header-main header-main--fixed">
      <div className="header-main__inner">
        <div className="header-main__logo">
          <a href="/fr.html" title="Vatican News" aria-label="Vatican News">
            <img src="/etc/designs/vatican-news/release/library/main/images/vatican-news-header-white.png" alt="Vatican News" />
          </a>
        </div>

        <nav className="header-main__nav" aria-label="Main menu">
          <ul className="mainMenu">
            {menuItems
              .filter((item) => item.enabled)
              .map((item) => (
                <li key={item.id}>
                  <a href={item.href} title={item.label} aria-label={item.label}>
                    {item.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        <div className="header-main__utility">
          <div className="languageBar languageBar--desktop">
            <div className="current-language">{(theme && theme.language && theme.language.default) || 'fr'}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
