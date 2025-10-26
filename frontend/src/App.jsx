import React from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <main id="main-content" className="content content--light content--large">
        <div className="content--large__inner">
          <h1>Page d'accueil (scaffold)</h1>
          <p>Cette application sert de scaffold React. Le style original est importé globalement pour préserver le rendu exact.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
