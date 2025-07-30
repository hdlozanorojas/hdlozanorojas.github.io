import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Play, 
  RefreshCw, 
  TrendingUp, 
  Database, 
  Brain,
  CheckCircle,
  Target,
  Award,
  ArrowRight
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import './DatosChallenge.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const DatosChallenge = ({ onComplete, onScoreChange }) => {
  const [currentPhase, setCurrentPhase] = useState('instructions') // instructions, exploration, modeling, prediction, results
  const [dataset, setDataset] = useState(null)
  const [selectedDataset, setSelectedDataset] = useState('')
  const [explorationStep, setExplorationStep] = useState(0)
  const [modelType, setModelType] = useState('')
  const [predictions, setPredictions] = useState([])
  const [score, setScore] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [isTraining, setIsTraining] = useState(false)

  // Datasets disponibles para análisis
  const datasets = {
    ventas: {
      name: 'Ventas de Productos Tech',
      description: 'Datos de ventas mensuales de productos tecnológicos',
      data: [
        { mes: 'Ene', ventas: 120, publicidad: 5000, satisfaccion: 4.2 },
        { mes: 'Feb', ventas: 135, publicidad: 6000, satisfaccion: 4.3 },
        { mes: 'Mar', ventas: 150, publicidad: 7000, satisfaccion: 4.1 },
        { mes: 'Abr', ventas: 180, publicidad: 8500, satisfaccion: 4.5 },
        { mes: 'May', ventas: 200, publicidad: 9000, satisfaccion: 4.4 },
        { mes: 'Jun', ventas: 220, publicidad: 10000, satisfaccion: 4.6 },
        { mes: 'Jul', ventas: 195, publicidad: 9500, satisfaccion: 4.3 },
        { mes: 'Ago', ventas: 210, publicidad: 9800, satisfaccion: 4.5 },
        { mes: 'Sep', ventas: 240, publicidad: 11000, satisfaccion: 4.7 },
        { mes: 'Oct', ventas: 260, publicidad: 12000, satisfaccion: 4.6 }
      ],
      target: 'ventas',
      features: ['publicidad', 'satisfaccion']
    },
    clima: {
      name: 'Datos Climáticos y Energía',
      description: 'Consumo energético basado en condiciones climáticas',
      data: [
        { dia: 1, temperatura: 22, humedad: 65, consumo_energia: 85 },
        { dia: 2, temperatura: 25, humedad: 70, consumo_energia: 95 },
        { dia: 3, temperatura: 28, humedad: 75, consumo_energia: 110 },
        { dia: 4, temperatura: 30, humedad: 80, consumo_energia: 125 },
        { dia: 5, temperatura: 27, humedad: 72, consumo_energia: 105 },
        { dia: 6, temperatura: 24, humedad: 68, consumo_energia: 90 },
        { dia: 7, temperatura: 26, humedad: 73, consumo_energia: 100 },
        { dia: 8, temperatura: 29, humedad: 78, consumo_energia: 120 },
        { dia: 9, temperatura: 31, humedad: 82, consumo_energia: 135 },
        { dia: 10, temperatura: 23, humedad: 66, consumo_energia: 88 }
      ],
      target: 'consumo_energia',
      features: ['temperatura', 'humedad']
    },
    estudiantes: {
      name: 'Rendimiento Académico',
      description: 'Predicción de calificaciones basada en hábitos de estudio',
      data: [
        { estudiante: 1, horas_estudio: 2, participacion: 60, calificacion: 75 },
        { estudiante: 2, horas_estudio: 4, participacion: 85, calificacion: 88 },
        { estudiante: 3, horas_estudio: 6, participacion: 90, calificacion: 95 },
        { estudiante: 4, horas_estudio: 3, participacion: 70, calificacion: 82 },
        { estudiante: 5, horas_estudio: 5, participacion: 88, calificacion: 92 },
        { estudiante: 6, horas_estudio: 1, participacion: 45, calificacion: 65 },
        { estudiante: 7, horas_estudio: 7, participacion: 95, calificacion: 98 },
        { estudiante: 8, horas_estudio: 2.5, participacion: 65, calificacion: 78 },
        { estudiante: 9, horas_estudio: 4.5, participacion: 80, calificacion: 89 },
        { estudiante: 10, horas_estudio: 3.5, participacion: 75, calificacion: 85 }
      ],
      target: 'calificacion',
      features: ['horas_estudio', 'participacion']
    }
  }

  useEffect(() => {
    onScoreChange(score)
  }, [score, onScoreChange])

  const startExploration = (datasetKey) => {
    setSelectedDataset(datasetKey)
    setDataset(datasets[datasetKey])
    setCurrentPhase('exploration')
    setExplorationStep(0)
  }

  const createVisualization = (data, type) => {
    if (!data) return null

    const labels = data.data.map((item, index) => 
      item.mes || item.dia || `Item ${index + 1}`
    )

    if (type === 'line') {
      return {
        labels,
        datasets: [
          {
            label: data.target.charAt(0).toUpperCase() + data.target.slice(1),
            data: data.data.map(item => item[data.target]),
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4
          }
        ]
      }
    }

    if (type === 'correlation') {
      return {
        labels,
        datasets: data.features.map((feature, index) => ({
          label: feature.charAt(0).toUpperCase() + feature.slice(1),
          data: data.data.map(item => item[feature]),
          backgroundColor: index === 0 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)',
          borderColor: index === 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
          borderWidth: 2
        }))
      }
    }
  }

  const trainModel = () => {
    setIsTraining(true)
    setCurrentPhase('modeling')
    
    // Simulación de entrenamiento de modelo
    setTimeout(() => {
      const simulatedAccuracy = 75 + Math.random() * 20
      setAccuracy(simulatedAccuracy)
      
      // Generar predicciones simuladas
      const newPredictions = generatePredictions()
      setPredictions(newPredictions)
      
      setIsTraining(false)
      setCurrentPhase('prediction')
    }, 3000)
  }

  const generatePredictions = () => {
    if (!dataset) return []
    
    const lastValues = dataset.data.slice(-3)
    const predictions = []
    
    for (let i = 1; i <= 3; i++) {
      const lastTarget = lastValues[lastValues.length - 1][dataset.target]
      const trend = (lastValues[lastValues.length - 1][dataset.target] - lastValues[0][dataset.target]) / 3
      const prediction = lastTarget + (trend * i) + (Math.random() - 0.5) * 10
      
      predictions.push({
        period: `Predicción ${i}`,
        value: Math.round(prediction * 100) / 100,
        confidence: 85 + Math.random() * 10
      })
    }
    
    return predictions
  }

  const completeChallenge = () => {
    const finalScore = Math.round(50 + (accuracy * 0.5) + (Math.random() * 20))
    setScore(finalScore)
    setCurrentPhase('results')
    onComplete(finalScore)
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#fff' }
      },
      title: {
        display: true,
        color: '#fff'
      }
    },
    scales: {
      x: { 
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: { 
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  }

  return (
    <div className="datos-challenge">
      {/* Fase de Instrucciones */}
      {currentPhase === 'instructions' && (
        <motion.div 
          className="instructions-phase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="phase-header">
            <BarChart3 size={48} className="phase-icon" />
            <h2>El Predictor Inteligente</h2>
            <p>Analiza datos reales y crea modelos predictivos con IA</p>
          </div>

          <div className="instructions-content">
            <div className="instruction-steps">
              <div className="step">
                <Database className="step-icon" />
                <h3>1. Explorar Datos</h3>
                <p>Analiza patrones en diferentes conjuntos de datos</p>
              </div>
              <div className="step">
                <Brain className="step-icon" />
                <h3>2. Entrenar Modelo</h3>
                <p>Configura y entrena algoritmos de machine learning</p>
              </div>
              <div className="step">
                <TrendingUp className="step-icon" />
                <h3>3. Hacer Predicciones</h3>
                <p>Usa tu modelo para predecir valores futuros</p>
              </div>
            </div>

            <div className="dataset-selection">
              <h3>Selecciona un conjunto de datos para analizar:</h3>
              <div className="dataset-options">
                {Object.entries(datasets).map(([key, dataset]) => (
                  <motion.div
                    key={key}
                    className="dataset-card"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => startExploration(key)}
                  >
                    <h4>{dataset.name}</h4>
                    <p>{dataset.description}</p>
                    <div className="dataset-stats">
                      <span>{dataset.data.length} registros</span>
                      <span>{dataset.features.length + 1} variables</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fase de Exploración */}
      {currentPhase === 'exploration' && dataset && (
        <motion.div 
          className="exploration-phase"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="phase-header">
            <Database size={36} className="phase-icon" />
            <h3>Explorando: {dataset.name}</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(explorationStep + 1) * 25}%` }}
              />
            </div>
          </div>

          <div className="exploration-content">
            {explorationStep === 0 && (
              <div className="data-overview">
                <h4>Vista General de los Datos</h4>
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(dataset.data[0]).map(key => (
                          <th key={key}>{key.replace('_', ' ')}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.data.slice(0, 5).map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, i) => (
                            <td key={i}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button 
                  className="continue-btn"
                  onClick={() => setExplorationStep(1)}
                >
                  Analizar Tendencias <ArrowRight size={16} />
                </button>
              </div>
            )}

            {explorationStep === 1 && (
              <div className="trend-analysis">
                <h4>Análisis de Tendencias</h4>
                <div className="chart-container">
                  <Line 
                    data={createVisualization(dataset, 'line')} 
                    options={chartOptions}
                  />
                </div>
                <div className="insights">
                  <h5>Insights detectados:</h5>
                  <ul>
                    <li>📈 Tendencia general positiva en los datos</li>
                    <li>🔄 Patrones estacionales identificados</li>
                    <li>📊 Correlación detectada entre variables</li>
                  </ul>
                </div>
                <button 
                  className="continue-btn"
                  onClick={() => setExplorationStep(2)}
                >
                  Ver Correlaciones <ArrowRight size={16} />
                </button>
              </div>
            )}

            {explorationStep === 2 && (
              <div className="correlation-analysis">
                <h4>Análisis de Correlaciones</h4>
                <div className="chart-container">
                  <Bar 
                    data={createVisualization(dataset, 'correlation')} 
                    options={chartOptions}
                  />
                </div>
                <div className="correlation-insights">
                  <h5>Correlaciones encontradas:</h5>
                  <div className="correlation-items">
                    {dataset.features.map((feature, index) => (
                      <div key={feature} className="correlation-item">
                        <span className="feature-name">{feature}</span>
                        <div className="correlation-strength">
                          <div 
                            className="strength-bar"
                            style={{ width: `${70 + Math.random() * 25}%` }}
                          />
                          <span>{(0.7 + Math.random() * 0.25).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  className="continue-btn"
                  onClick={() => setCurrentPhase('modeling')}
                >
                  Entrenar Modelo <Brain size={16} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Fase de Modelado */}
      {currentPhase === 'modeling' && (
        <motion.div 
          className="modeling-phase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="phase-header">
            <Brain size={36} className="phase-icon" />
            <h3>Entrenamiento del Modelo</h3>
          </div>

          <div className="model-selection">
            <h4>Selecciona el tipo de modelo:</h4>
            <div className="model-options">
              <motion.div
                className={`model-card ${modelType === 'linear' ? 'selected' : ''}`}
                onClick={() => setModelType('linear')}
                whileHover={{ scale: 1.02 }}
              >
                <h5>Regresión Lineal</h5>
                <p>Ideal para relaciones lineales simples</p>
                <div className="model-stats">
                  <span>Velocidad: Rápida</span>
                  <span>Precisión: Buena</span>
                </div>
              </motion.div>

              <motion.div
                className={`model-card ${modelType === 'polynomial' ? 'selected' : ''}`}
                onClick={() => setModelType('polynomial')}
                whileHover={{ scale: 1.02 }}
              >
                <h5>Regresión Polinomial</h5>
                <p>Captura relaciones más complejas</p>
                <div className="model-stats">
                  <span>Velocidad: Media</span>
                  <span>Precisión: Muy Buena</span>
                </div>
              </motion.div>

              <motion.div
                className={`model-card ${modelType === 'neural' ? 'selected' : ''}`}
                onClick={() => setModelType('neural')}
                whileHover={{ scale: 1.02 }}
              >
                <h5>Red Neuronal</h5>
                <p>Máxima capacidad de aprendizaje</p>
                <div className="model-stats">
                  <span>Velocidad: Lenta</span>
                  <span>Precisión: Excelente</span>
                </div>
              </motion.div>
            </div>

            {modelType && !isTraining && (
              <button className="train-btn" onClick={trainModel}>
                <Play size={20} />
                Entrenar Modelo {modelType}
              </button>
            )}

            {isTraining && (
              <div className="training-status">
                <div className="training-animation">
                  <Brain className="spinning-brain" size={48} />
                </div>
                <h4>Entrenando modelo...</h4>
                <p>Procesando datos y optimizando parámetros</p>
                <div className="training-progress">
                  <div className="progress-bar animated">
                    <div className="progress-fill" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Fase de Predicción */}
      {currentPhase === 'prediction' && (
        <motion.div 
          className="prediction-phase"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="phase-header">
            <TrendingUp size={36} className="phase-icon" />
            <h3>Predicciones del Modelo</h3>
            <div className="accuracy-badge">
              Precisión: {accuracy.toFixed(1)}%
            </div>
          </div>

          <div className="predictions-content">
            <div className="model-performance">
              <h4>Rendimiento del Modelo</h4>
              <div className="performance-metrics">
                <div className="metric">
                  <span className="metric-label">Precisión</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                  <span className="metric-value">{accuracy.toFixed(1)}%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Confianza</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${85 + Math.random() * 10}%` }}
                    />
                  </div>
                  <span className="metric-value">{(85 + Math.random() * 10).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="predictions-results">
              <h4>Predicciones Futuras</h4>
              <div className="predictions-grid">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={index}
                    className="prediction-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <h5>{prediction.period}</h5>
                    <div className="prediction-value">
                      {prediction.value}
                    </div>
                    <div className="confidence-level">
                      Confianza: {prediction.confidence.toFixed(1)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button className="complete-btn" onClick={completeChallenge}>
              <CheckCircle size={20} />
              Completar Desafío
            </button>
          </div>
        </motion.div>
      )}

      {/* Fase de Resultados */}
      {currentPhase === 'results' && (
        <motion.div 
          className="results-phase"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="results-content">
            <Award size={64} className="award-icon" />
            <h2>¡Desafío Completado!</h2>
            <div className="final-score">
              <span className="score-label">Puntuación Final</span>
              <span className="score-value">{score}</span>
              <span className="score-max">/ 100</span>
            </div>

            <div className="achievements">
              <h3>Logros Desbloqueados:</h3>
              <div className="achievement-list">
                <div className="achievement">
                  <Target className="achievement-icon" />
                  <span>Analista de Datos</span>
                </div>
                <div className="achievement">
                  <Brain className="achievement-icon" />
                  <span>Entrenador de IA</span>
                </div>
                <div className="achievement">
                  <TrendingUp className="achievement-icon" />
                  <span>Predictor Experto</span>
                </div>
              </div>
            </div>

            <div className="learned-concepts">
              <h3>Conceptos Aprendidos:</h3>
              <ul>
                <li>✓ Análisis exploratorio de datos</li>
                <li>✓ Correlaciones entre variables</li>
                <li>✓ Entrenamiento de modelos ML</li>
                <li>✓ Evaluación de precisión</li>
                <li>✓ Predicciones futuras</li>
              </ul>
            </div>

            <button className="restart-btn" onClick={() => {
              setCurrentPhase('instructions')
              setScore(0)
              setDataset(null)
              setSelectedDataset('')
              setExplorationStep(0)
              setModelType('')
              setPredictions([])
              setAccuracy(0)
            }}>
              <RefreshCw size={20} />
              Intentar Nuevo Dataset
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DatosChallenge
