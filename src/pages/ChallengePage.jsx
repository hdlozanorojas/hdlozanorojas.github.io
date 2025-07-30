import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Star, RefreshCw } from 'lucide-react'
import { useGame } from '../context/GameContext'

// Importar componentes de desafíos
import SistemasChallenge from '../components/challenges/SistemasChallenge'
import AmbientalChallenge from '../components/challenges/AmbientalChallenge'
import IndustrialChallenge from '../components/challenges/IndustrialChallenge'
import ElectronicaChallenge from '../components/challenges/ElectronicaChallenge'
import MecanicaChallenge from '../components/challenges/MecanicaChallenge'
import BiologiaChallenge from '../components/challenges/BiologiaChallenge'
import DatosChallenge from '../components/challenges/DatosChallenge'

import './ChallengePage.css'

const ChallengePage = () => {
  const { programId } = useParams()
  const navigate = useNavigate()
  const { challenges, completeChallenge, startChallenge } = useGame()
  const [currentScore, setCurrentScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const challengeComponents = {
    'sistemas': SistemasChallenge,
    'ambiental': AmbientalChallenge,
    'industrial': IndustrialChallenge,
    'electronica': ElectronicaChallenge,
    'mecanica': MecanicaChallenge,
    'biologia': BiologiaChallenge,
    'datos': DatosChallenge
  }

  const challengeInfo = {
    'sistemas': {
      title: 'El Entrenador de Robots',
      subtitle: 'Ingeniería de Sistemas y Computación',
      description: 'Entrena un modelo de IA para reconocer diferentes objetos',
      color: '#4F46E5'
    },
    'ambiental': {
      title: 'El Guardián del Ecosistema IA',
      subtitle: 'Ingeniería Ambiental',
      description: 'Optimiza la recolección de residuos usando inteligencia artificial',
      color: '#059669'
    },
    'industrial': {
      title: 'Optimizando la Fábrica del Futuro',
      subtitle: 'Ingeniería Industrial',
      description: 'Diseña la línea de producción más eficiente',
      color: '#DC2626'
    },
    'electronica': {
      title: 'El Circuit Maker Inteligente',
      subtitle: 'Ingeniería Electrónica',
      description: 'Construye circuitos que reaccionan con sensores inteligentes',
      color: '#F59E0B'
    },
    'mecanica': {
      title: 'Robots en Acción',
      subtitle: 'Ingeniería Mecánica',
      description: 'Programa un robot para completar tareas complejas',
      color: '#7C3AED'
    },
    'biologia': {
      title: 'El Bio-Detective de IA',
      subtitle: 'Biología',
      description: 'Clasifica especies y realiza diagnósticos con IA',
      color: '#EC4899'
    },
    'datos': {
      title: 'El Predictor Inteligente',
      subtitle: 'Ciencias de Datos',
      description: 'Analiza datos para predecir tendencias futuras',
      color: '#0891B2'
    }
  }

  const currentChallenge = challengeInfo[programId]
  const ChallengeComponent = challengeComponents[programId]
  const existingProgress = challenges[programId]

  useEffect(() => {
    if (programId) {
      startChallenge(programId)
    }
  }, [programId, startChallenge])

  const handleChallengeComplete = (score) => {
    console.log('🎯 ChallengePage - Completando desafío:', { programId, score })
    setCurrentScore(score)
    setIsCompleted(true)
    setShowResults(true)
    completeChallenge(programId, score)
  }

  const handleRetry = () => {
    setCurrentScore(0)
    setIsCompleted(false)
    setShowResults(false)
  }

  const handleBackToMap = () => {
    navigate('/mapa')
  }

  if (!currentChallenge || !ChallengeComponent) {
    return (
      <div className="challenge-error">
        <h2>Desafío no encontrado</h2>
        <button onClick={handleBackToMap}>Volver al Mapa</button>
      </div>
    )
  }

  return (
    <div className="challenge-page fullscreen-challenge" style={{ '--challenge-color': currentChallenge.color }}>
      {/* Header */}
      <motion.header 
        className="challenge-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <button className="back-button" onClick={handleBackToMap}>
          <ArrowLeft size={20} />
          Volver al Mapa
        </button>

        <div className="challenge-info">
          <h1 className="challenge-title">{currentChallenge.title}</h1>
          <p className="challenge-subtitle">{currentChallenge.subtitle}</p>
        </div>

        <div className="challenge-stats">
          {existingProgress?.completed && (
            <div className="previous-score">
              <Trophy size={20} />
              <span>Mejor: {existingProgress.points} pts</span>
            </div>
          )}
          <div className="current-score">
            <Star size={20} />
            <span>Actual: {currentScore} pts</span>
          </div>
        </div>
      </motion.header>

      {/* Challenge Content */}
      <main className="challenge-content no-padding">
        {!showResults ? (
          <motion.div
            className="challenge-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ChallengeComponent 
              onComplete={handleChallengeComplete}
              onScoreChange={setCurrentScore}
            />
          </motion.div>
        ) : (
          <motion.div
            className="results-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="results-card">
              <div className="results-header">
                <div className="trophy-icon">
                  <Trophy size={64} />
                </div>
                <h2>¡Desafío Completado!</h2>
                <p>Has terminado: {currentChallenge.title}</p>
              </div>

              <div className="results-score">
                <div className="score-display">
                  <span className="score-label">Tu Puntuación</span>
                  <span className="score-value">{currentScore}</span>
                  <span className="score-max">/ 100 puntos</span>
                </div>

                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ width: `${currentScore}%` }}
                  ></div>
                </div>

                {currentScore >= 80 && (
                  <div className="achievement-badge">
                    <Star size={24} />
                    <span>¡Excelente trabajo!</span>
                  </div>
                )}
              </div>

              <div className="results-actions">
                <button 
                  className="retry-button"
                  onClick={handleRetry}
                >
                  <RefreshCw size={20} />
                  Intentar de Nuevo
                </button>
                <button 
                  className="continue-button"
                  onClick={handleBackToMap}
                >
                  Continuar Aventura
                </button>
              </div>

              {existingProgress?.points && currentScore > existingProgress.points && (
                <div className="new-record">
                  🎉 ¡Nuevo récord personal!
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default ChallengePage
