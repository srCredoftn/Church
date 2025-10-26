import React from 'react'

export default function Footer() {
  return (
    <footer className="footer-menu__wrapper">
      <div className="footer-menu">
        <div className="footer-column__wrapper">
          <a className="footer__logo" href="/fr.html" title="Vatican News" aria-label="Vatican News">
            <img className="footer-menu__logo" src="/etc/designs/vatican-news/release/library/main/images/vatican-news-footer-white.png" alt="Vatican News" />
          </a>
        </div>
        <div className="footer__copyright">
          <span>Copyright © 2017-2025 Dicasterium pro Communicatione - Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  )
}
