import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import AdventureMap from './pages/AdventureMap'
import AdventureMapSimple from './pages/AdventureMapSimple'
import ProfilePage from './pages/ProfilePage'
import ChallengePage from './pages/ChallengePage'
import GuidesProfessors from './pages/GuidesProfessors'
import SimpleTest from './components/SimpleTest'
import { GameProvider } from './context/GameContext'
import './App.css'

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="app">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/mapa" element={<AdventureMapSimple />} />
              <Route path="/desafio/:programId" element={<ChallengePage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/guias" element={<GuidesProfessors />} />
            </Routes>
          </motion.div>
        </div>
      </Router>
    </GameProvider>
  )
}

export default App
