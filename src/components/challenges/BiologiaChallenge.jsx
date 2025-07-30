import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Microscope, 
  Camera, 
  Brain, 
  CheckCircle, 
  XCircle, 
  Trophy,
  Dna,
  Eye,
  Search,
  Zap
} from 'lucide-react'
import './BiologiaChallenge.css'

// Base de datos de especies con sus características
const speciesDatabase = [
  {
    id: 1,
    name: "Escherichia coli",
    type: "Bacteria",
    category: "Microorganismo",
    image: "🦠",
    characteristics: ["Forma de bastón", "Gram negativa", "Móvil", "Facultativa"],
    habitat: "Intestino de mamíferos",
    size: "2-3 μm",
    description: "Bacteria común en el intestino, algunas cepas son patógenas"
  },
  {
    id: 2,
    name: "Quercus robur",
    type: "Planta",
    category: "Árbol",
    image: "🌳",
    characteristics: ["Hojas lobuladas", "Deciduo", "Corteza rugosa", "Frutos: bellotas"],
    habitat: "Bosques templados",
    size: "25-35 m",
    description: "Roble común europeo, árbol longevo y resistente"
  },
  {
    id: 3,
    name: "Panthera leo",
    type: "Animal",
    category: "Mamífero",
    image: "🦁",
    characteristics: ["Melena en machos", "Carnívoro", "Social", "Garras retráctiles"],
    habitat: "Sabanas africanas",
    size: "1.4-2.5 m",
    description: "León africano, apex predator y cazador social"
  },
  {
    id: 4,
    name: "Saccharomyces cerevisiae",
    type: "Hongo",
    category: "Levadura",
    image: "🍄",
    characteristics: ["Unicelular", "Reproduce por gemación", "Fermenta azúcares", "Oval"],
    habitat: "Frutas y plantas",
    size: "3-8 μm",
    description: "Levadura de cerveza, importante en biotecnología"
  },
  {
    id: 5,
    name: "Plasmodium falciparum",
    type: "Protista",
    category: "Parásito",
    image: "🔬",
    characteristics: ["Unicelular", "Parásito intracelular", "Ciclo complejo", "Móvil"],
    habitat: "Sangre humana/mosquito",
    size: "1-2 μm",
    description: "Parásito causante de malaria, transmitido por mosquitos"
  },
  {
    id: 6,
    name: "Tyrannosaurus rex",
    type: "Fósil",
    category: "Dinosaurio",
    image: "🦕",
    characteristics: ["Bípedo", "Carnívoro", "Brazos pequeños", "Dientes grandes"],
    habitat: "Cretácico tardío",
    size: "12-13 m",
    description: "Dinosaurio depredador del período Cretácico"
  }
]

const BiologiaChallenge = ({ onComplete, onScoreChange }) => {
  const [currentPhase, setCurrentPhase] = useState('instructions') // instructions, classification, analysis, results
  const [score, setScore] = useState(0)
  const [currentSpecimen, setCurrentSpecimen] = useState(null)
  const [classificationHistory, setClassificationHistory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutos
  const [gameStarted, setGameStarted] = useState(false)

  // Categorías y tipos disponibles
  const categories = ["Microorganismo", "Árbol", "Mamífero", "Levadura", "Parásito", "Dinosaurio"]
  const types = ["Bacteria", "Planta", "Animal", "Hongo", "Protista", "Fósil"]

  // Timer
  useEffect(() => {
    let timer
    if (gameStarted && timeLeft > 0 && currentPhase !== 'results') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameStarted, timeLeft, currentPhase])

  const startGame = () => {
    setCurrentPhase('classification')
    setGameStarted(true)
    generateNewSpecimen()
  }

  const generateNewSpecimen = () => {
    const randomSpecies = speciesDatabase[Math.floor(Math.random() * speciesDatabase.length)]
    setCurrentSpecimen(randomSpecies)
    setSelectedCategory('')
    setSelectedType('')
    setShowAnalysis(false)
    setAnalysisComplete(false)
  }

  const submitClassification = () => {
    if (!selectedCategory || !selectedType || !currentSpecimen) return

    const isCorrectCategory = selectedCategory === currentSpecimen.category
    const isCorrectType = selectedType === currentSpecimen.type
    const isFullyCorrect = isCorrectCategory && isCorrectType

    let points = 0
    if (isFullyCorrect) points = 20
    else if (isCorrectCategory || isCorrectType) points = 10

    const newClassification = {
      specimen: currentSpecimen,
      selectedCategory,
      selectedType,
      correctCategory: currentSpecimen.category,
      correctType: currentSpecimen.type,
      points,
      isCorrect: isFullyCorrect
    }

    setClassificationHistory(prev => [...prev, newClassification])
    setScore(prev => prev + points)
    setShowAnalysis(true)

    // Mostrar análisis por 3 segundos
    setTimeout(() => {
      setAnalysisComplete(true)
      setTimeout(() => {
        if (classificationHistory.length >= 4) {
          finishGame()
        } else {
          generateNewSpecimen()
        }
      }, 1000)
    }, 3000)
  }

  const finishGame = () => {
    setCurrentPhase('results')
    setGameStarted(false)
    const finalScore = Math.min(100, score)
    onScoreChange(finalScore)
    onComplete(finalScore)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="biologia-challenge">
      <AnimatePresence mode="wait">
        {currentPhase === 'instructions' && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="instructions-phase"
          >
            <div className="bio-header">
              <Microscope size={48} className="bio-icon" />
              <h2>El Bio-Detective de IA</h2>
              <p className="bio-subtitle">Clasifica especies usando inteligencia artificial</p>
            </div>

            <div className="instructions-content">
              <div className="instruction-card">
                <Camera className="instruction-icon" />
                <h3>Observa el Espécimen</h3>
                <p>Analiza cuidadosamente las características de cada organismo</p>
              </div>

              <div className="instruction-card">
                <Brain className="instruction-icon" />
                <h3>Clasifica Correctamente</h3>
                <p>Identifica la categoría (Microorganismo, Árbol, etc.) y tipo (Bacteria, Planta, etc.)</p>
              </div>

              <div className="instruction-card">
                <Dna className="instruction-icon" />
                <h3>Analiza Resultados</h3>
                <p>Recibe retroalimentación sobre tu clasificación y aprende</p>
              </div>
            </div>

            <div className="scoring-info">
              <h3>Sistema de Puntuación</h3>
              <div className="score-rules">
                <div className="rule">✅ Clasificación completa correcta: <strong>20 puntos</strong></div>
                <div className="rule">🟡 Clasificación parcial correcta: <strong>10 puntos</strong></div>
                <div className="rule">❌ Clasificación incorrecta: <strong>0 puntos</strong></div>
              </div>
            </div>

            <button className="start-bio-btn" onClick={startGame}>
              <Microscope size={20} />
              Iniciar Bio-Detective
            </button>
          </motion.div>
        )}

        {currentPhase === 'classification' && (
          <motion.div
            key="classification"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="classification-phase"
          >
            <div className="bio-game-header">
              <div className="game-stats">
                <div className="stat">
                  <Zap className="stat-icon" />
                  <span>Puntos: {score}</span>
                </div>
                <div className="stat">
                  <Eye className="stat-icon" />
                  <span>Especímenes: {classificationHistory.length}/5</span>
                </div>
                <div className="stat timer">
                  <span>⏱️ {formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            {currentSpecimen && !showAnalysis && (
              <div className="specimen-analysis">
                <div className="specimen-viewer">
                  <div className="specimen-display">
                    <div className="specimen-image">
                      <span className="organism-emoji">{currentSpecimen.image}</span>
                    </div>
                    <div className="specimen-info">
                      <h3>Espécimen #{classificationHistory.length + 1}</h3>
                      <div className="characteristics">
                        <h4>Características Observadas:</h4>
                        <ul>
                          {currentSpecimen.characteristics.map((char, index) => (
                            <li key={index}>{char}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="specimen-details">
                        <p><strong>Hábitat:</strong> {currentSpecimen.habitat}</p>
                        <p><strong>Tamaño:</strong> {currentSpecimen.size}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="classification-panel">
                  <h3>Clasificación del Espécimen</h3>
                  
                  <div className="classification-section">
                    <label>Categoría:</label>
                    <div className="classification-options">
                      {categories.map(category => (
                        <button
                          key={category}
                          className={`classification-btn ${selectedCategory === category ? 'selected' : ''}`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="classification-section">
                    <label>Tipo:</label>
                    <div className="classification-options">
                      {types.map(type => (
                        <button
                          key={type}
                          className={`classification-btn ${selectedType === type ? 'selected' : ''}`}
                          onClick={() => setSelectedType(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    className="submit-classification-btn"
                    onClick={submitClassification}
                    disabled={!selectedCategory || !selectedType}
                  >
                    <Search size={20} />
                    Analizar Clasificación
                  </button>
                </div>
              </div>
            )}

            {showAnalysis && currentSpecimen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="analysis-results"
              >
                <div className="analysis-header">
                  <h3>Análisis de Clasificación</h3>
                  <div className="specimen-name">
                    <em>{currentSpecimen.name}</em>
                  </div>
                </div>

                <div className="analysis-content">
                  <div className="classification-comparison">
                    <div className="comparison-row">
                      <span>Tu clasificación:</span>
                      <span className="user-classification">
                        {selectedCategory} - {selectedType}
                      </span>
                      <span className={
                        selectedCategory === currentSpecimen.category && selectedType === currentSpecimen.type 
                          ? 'correct' : 'incorrect'
                      }>
                        {selectedCategory === currentSpecimen.category && selectedType === currentSpecimen.type 
                          ? <CheckCircle size={20} /> : <XCircle size={20} />}
                      </span>
                    </div>
                    
                    <div className="comparison-row">
                      <span>Clasificación correcta:</span>
                      <span className="correct-classification">
                        {currentSpecimen.category} - {currentSpecimen.type}
                      </span>
                      <CheckCircle size={20} className="correct" />
                    </div>
                  </div>

                  <div className="specimen-description">
                    <h4>Información del Espécimen:</h4>
                    <p>{currentSpecimen.description}</p>
                  </div>

                  <div className="points-earned">
                    <Trophy className="trophy-icon" />
                    <span>
                      Puntos obtenidos: {
                        selectedCategory === currentSpecimen.category && selectedType === currentSpecimen.type ? 20 :
                        selectedCategory === currentSpecimen.category || selectedType === currentSpecimen.type ? 10 : 0
                      }
                    </span>
                  </div>
                </div>

                {analysisComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="continue-indicator"
                  >
                    {classificationHistory.length >= 4 ? (
                      <p>Preparando resultados finales...</p>
                    ) : (
                      <p>Preparando siguiente espécimen...</p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {currentPhase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="results-phase"
          >
            <div className="results-header">
              <Trophy size={48} className="trophy-icon" />
              <h2>Bio-Detective Completo</h2>
              <div className="final-score">
                Puntuación Final: <span className="score-number">{score}/100</span>
              </div>
            </div>

            <div className="classification-summary">
              <h3>Resumen de Clasificaciones</h3>
              <div className="classification-list">
                {classificationHistory.map((classification, index) => (
                  <div 
                    key={index} 
                    className={`classification-item ${classification.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <div className="specimen-info">
                      <span className="specimen-emoji">{classification.specimen.image}</span>
                      <div className="specimen-details">
                        <div className="specimen-name">{classification.specimen.name}</div>
                        <div className="classification-result">
                          Tu clasificación: {classification.selectedCategory} - {classification.selectedType}
                        </div>
                        <div className="correct-answer">
                          Correcto: {classification.correctCategory} - {classification.correctType}
                        </div>
                      </div>
                    </div>
                    <div className="points">+{classification.points}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="performance-analysis">
              <h3>Análisis de Rendimiento</h3>
              <div className="performance-stats">
                <div className="stat-card">
                  <div className="stat-value">
                    {classificationHistory.filter(c => c.isCorrect).length}/{classificationHistory.length}
                  </div>
                  <div className="stat-label">Clasificaciones Perfectas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {Math.round((classificationHistory.filter(c => c.points > 0).length / classificationHistory.length) * 100)}%
                  </div>
                  <div className="stat-label">Precisión General</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{score}</div>
                  <div className="stat-label">Puntos Totales</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BiologiaChallenge
