import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Leaf, MapPin, Truck, Zap, RefreshCw, Play, CheckCircle, Brain, X, Activity, TrendingUp, RotateCcw, Cpu, Navigation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './AmbientalChallenge.css'

const AmbientalChallenge = ({ onComplete, onScoreChange }) => {
  const navigate = useNavigate()
  const [currentPhase, setCurrentPhase] = useState('instructions') // instructions, planning, simulation, results
  const [cityMap, setCityMap] = useState([])
  const [sensors, setSensors] = useState([])
  const [routes, setRoutes] = useState([])
  const [score, setScore] = useState(0)
  const [efficiency, setEfficiency] = useState(0)
  const [wasteCollected, setWasteCollected] = useState(0)
  const [energyUsed, setEnergyUsed] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationComplete, setSimulationComplete] = useState(false)

  // Generar mapa de la ciudad
  const generateCityMap = () => {
    const map = []
    // Generar exactamente 7 filas x 10 columnas = 70 celdas
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 10; j++) {
        const wasteLevel = Math.floor(Math.random() * 5) + 1
        const pollution = Math.floor(Math.random() * 4) + 1
        map.push({
          id: `${i}-${j}`,
          x: j,
          y: i,
          wasteLevel,
          pollution,
          hasSensor: false,
          isInRoute: false,
          collected: false
        })
      }
    }
    console.log(`Generando ${map.length} celdas (10x7=${10*7})`) // Debug
    setCityMap(map)
  }

  useEffect(() => {
    generateCityMap()
  }, [])

  useEffect(() => {
    onScoreChange(score)
  }, [score, onScoreChange])

  const calculateOptimalSolution = () => {
    // Algoritmo de optimización IA mejorado para encontrar la MEJOR solución posible
    console.log('🤖 Calculando solución óptima con IA avanzada...')
    
    // 1. Analizar todas las celdas y puntuarlas por eficiencia
    const cellScores = cityMap.map(cell => ({
      ...cell,
      sensorScore: (cell.pollution * 0.6) + (cell.wasteLevel * 0.4), // Prioridad a contaminación para sensores
      routeScore: (cell.wasteLevel * 0.7) + (cell.pollution * 0.3),  // Prioridad a residuos para rutas
      efficiency: (cell.pollution + cell.wasteLevel) / 2
    }))

    // 2. Seleccionar los 6 MEJORES ubicaciones para sensores (máxima contaminación)
    const optimalSensors = cellScores
      .sort((a, b) => b.sensorScore - a.sensorScore)
      .slice(0, 6) // Tomar los 6 mejores
    
    // 3. Seleccionar áreas de alta concentración de residuos para rutas
    const highWasteAreas = cellScores
      .filter(cell => cell.wasteLevel >= 4) // Solo áreas con residuos altos
      .sort((a, b) => b.routeScore - a.routeScore)
    
    const mediumWasteAreas = cellScores
      .filter(cell => cell.wasteLevel === 3)
      .sort((a, b) => b.routeScore - a.routeScore)

    // 4. Crear ruta optimizada usando algoritmo de proximidad mejorado
    let availableCells = [...highWasteAreas, ...mediumWasteAreas]
    let optimalRoute = []
    
    // Comenzar con la celda de mayor valor
    let currentCell = availableCells[0]
    optimalRoute.push(currentCell)
    availableCells = availableCells.filter(cell => cell.id !== currentCell.id)
    
    // Algoritmo de vecino más cercano optimizado
    while (optimalRoute.length < 8 && availableCells.length > 0) {
      let bestNext = null
      let bestScore = -1
      
      availableCells.forEach(cell => {
        // Calcular distancia al punto actual
        const distance = Math.sqrt(
          Math.pow(cell.x - currentCell.x, 2) + 
          Math.pow(cell.y - currentCell.y, 2)
        )
        
        // Puntuación combinada: valor de la celda / distancia (priorizar cercanos y valiosos)
        const score = (cell.routeScore * 2) / (distance + 1) // +1 para evitar división por 0
        
        if (score > bestScore) {
          bestScore = score
          bestNext = cell
        }
      })
      
      if (bestNext) {
        optimalRoute.push(bestNext)
        currentCell = bestNext
        availableCells = availableCells.filter(cell => cell.id !== bestNext.id)
      } else {
        break
      }
    }
    
    // 5. Si no tenemos 8 rutas, completar con las mejores celdas restantes
    if (optimalRoute.length < 8) {
      const remainingCells = cellScores
        .filter(cell => !optimalRoute.some(route => route.id === cell.id))
        .sort((a, b) => b.routeScore - a.routeScore)
        .slice(0, 8 - optimalRoute.length)
      
      optimalRoute = [...optimalRoute, ...remainingCells]
    }

    console.log(`✅ Solución IA calculada: ${optimalSensors.length} sensores óptimos, ${optimalRoute.length} rutas eficientes`)
    
    return { optimalSensors, optimalRoute }
  }

  // Función para calcular bonus de cobertura estratégica
  const calculateCoverageBonus = (sensorList) => {
    if (sensorList.length === 0) return 0
    
    // Calcular distribución de sensores en el mapa
    const sensorPositions = sensorList.map(sensor => {
      const cell = cityMap.find(c => c.id === sensor.cellId)
      return { x: cell?.x || 0, y: cell?.y || 0 }
    })
    
    // Bonus por distribución espacial (evitar concentración en una zona)
    const avgX = sensorPositions.reduce((sum, pos) => sum + pos.x, 0) / sensorPositions.length
    const avgY = sensorPositions.reduce((sum, pos) => sum + pos.y, 0) / sensorPositions.length
    
    const spread = sensorPositions.reduce((sum, pos) => {
      return sum + Math.sqrt(Math.pow(pos.x - avgX, 2) + Math.pow(pos.y - avgY, 2))
    }, 0) / sensorPositions.length
    
    return Math.min(20, spread * 2) // Máximo 20 puntos por buena distribución
  }

  // Función para calcular bonus de eficiencia de ruta
  const calculateRouteEfficiencyBonus = (routeList) => {
    if (routeList.length < 2) return 0
    
    let totalDistance = 0
    for (let i = 1; i < routeList.length; i++) {
      const prevCell = cityMap.find(c => c.id === routeList[i-1])
      const currentCell = cityMap.find(c => c.id === routeList[i])
      
      if (prevCell && currentCell) {
        const distance = Math.sqrt(
          Math.pow(currentCell.x - prevCell.x, 2) + 
          Math.pow(currentCell.y - prevCell.y, 2)
        )
        totalDistance += distance
      }
    }
    
    const avgDistance = totalDistance / (routeList.length - 1)
    // Bonus inversamente proporcional a la distancia promedio (rutas más cortas = mejor)
    return Math.max(0, 15 - avgDistance * 2)
  }

  const placeSensor = (cellId) => {
    if (sensors.length >= 6) return
    
    const newSensor = {
      id: cellId,
      cellId,
      efficiency: Math.random() * 0.3 + 0.7 // 70-100% efficiency
    }
    
    setSensors([...sensors, newSensor])
    setCityMap(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, hasSensor: true } : cell
    ))
  }

  const removeSensor = (cellId) => {
    setSensors(prev => prev.filter(sensor => sensor.cellId !== cellId))
    setCityMap(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, hasSensor: false } : cell
    ))
  }

  const toggleRoutePoint = (cellId) => {
    const isInRoute = routes.includes(cellId)
    
    if (isInRoute) {
      setRoutes(prev => prev.filter(id => id !== cellId))
      setCityMap(prev => prev.map(cell => 
        cell.id === cellId ? { ...cell, isInRoute: false } : cell
      ))
    } else if (routes.length < 8) {
      setRoutes(prev => [...prev, cellId])
      setCityMap(prev => prev.map(cell => 
        cell.id === cellId ? { ...cell, isInRoute: true } : cell
      ))
    }
  }

  const runSimulation = async () => {
    setIsSimulating(true)
    setCurrentPhase('simulation')

    // Calcular métricas basadas en la configuración del usuario
    let totalWaste = 0
    let totalEnergy = 0
    let collectedWaste = 0

    // Simular recolección paso a paso
    for (let i = 0; i < routes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const cellId = routes[i]
      const cell = cityMap.find(c => c.id === cellId)
      
      if (cell) {
        const wasteInCell = cell.wasteLevel * 10
        const energyCost = Math.sqrt(Math.pow(cell.x - (i > 0 ? 
          cityMap.find(c => c.id === routes[i-1])?.x || 0 : 0), 2) + 
          Math.pow(cell.y - (i > 0 ? 
          cityMap.find(c => c.id === routes[i-1])?.y || 0 : 0), 2)) * 5

        totalWaste += wasteInCell
        collectedWaste += wasteInCell
        totalEnergy += energyCost

        setCityMap(prev => prev.map(c => 
          c.id === cellId ? { ...c, collected: true } : c
        ))
        setWasteCollected(collectedWaste)
        setEnergyUsed(Math.round(totalEnergy))
      }
    }

    // Bonus por sensores bien colocados
    const sensorBonus = sensors.reduce((bonus, sensor) => {
      const cell = cityMap.find(c => c.id === sensor.cellId)
      return bonus + (cell?.pollution || 0) * sensor.efficiency * 10
    }, 0)

    // Calcular eficiencia final con bonificación IA
    const maxPossibleWaste = cityMap.reduce((sum, cell) => sum + cell.wasteLevel * 10, 0)
    const wasteEfficiency = (collectedWaste / maxPossibleWaste) * 100
    const energyEfficiency = Math.max(0, 100 - (totalEnergy / 15)) // Más generoso para rutas eficientes
    
    // Calcular eficiencia de sensores mejorada
    const sensorEfficiency = sensors.reduce((efficiency, sensor) => {
      const cell = cityMap.find(c => c.id === sensor.cellId)
      const cellValue = ((cell?.pollution || 0) + (cell?.wasteLevel || 0)) / 2
      return efficiency + (cellValue * sensor.efficiency * 12) // Multiplicador mejorado
    }, 0) / sensors.length || 0

    // Bonificaciones adicionales para soluciones completas
    const completionBonus = (sensors.length >= 6 ? 15 : sensors.length * 2) + 
                           (routes.length >= 8 ? 15 : routes.length * 1.5)
    
    // Bonus por distribución estratégica de sensores (cobertura del mapa)
    const coverageBonus = sensors.length >= 4 ? calculateCoverageBonus(sensors) : 0
    
    // Bonus por eficiencia de ruta (distancias cortas entre puntos consecutivos)
    const routeEfficiencyBonus = calculateRouteEfficiencyBonus(routes)

    const finalEfficiency = (wasteEfficiency * 0.35 + energyEfficiency * 0.25 + sensorEfficiency * 0.25 + coverageBonus * 0.15)
    const finalScore = Math.min(100, Math.round(finalEfficiency + completionBonus + routeEfficiencyBonus))

    console.log(`📊 Puntuación final: ${finalScore}% (Residuos: ${Math.round(wasteEfficiency)}%, Energía: ${Math.round(energyEfficiency)}%, Sensores: ${Math.round(sensorEfficiency)}%, Cobertura: ${Math.round(coverageBonus)}%)`)
    
    setEfficiency(Math.round(finalEfficiency))
    setScore(finalScore)
    setIsSimulating(false)
    setSimulationComplete(true) // Marcar simulación como completa sin cambiar de fase
    onComplete(finalScore)
  }

  const goToResults = () => {
    setCurrentPhase('results')
  }

  const resetChallenge = () => {
    setCurrentPhase('instructions')
    setSensors([])
    setRoutes([])
    setScore(0)
    setEfficiency(0)
    setWasteCollected(0)
    setEnergyUsed(0)
    setIsSimulating(false)
    setSimulationComplete(false)
    generateCityMap()
  }

  const useAIOptimization = () => {
    const { optimalSensors, optimalRoute } = calculateOptimalSolution()
    
    // Limpiar configuración actual
    setSensors([])
    setRoutes([])
    setCityMap(prev => prev.map(cell => ({ 
      ...cell, 
      hasSensor: false, 
      isInRoute: false 
    })))

    // Aplicar solución óptima
    setTimeout(() => {
      optimalSensors.forEach(cell => placeSensor(cell.id))
      setTimeout(() => {
        optimalRoute.forEach(cell => toggleRoutePoint(cell.id))
      }, 500)
    }, 100)
  }

  const getCellColor = (cell) => {
    if (cell.collected) return '#22C55E'
    if (cell.isInRoute) return '#F59E0B'
    if (cell.hasSensor) return '#3B82F6'
    
    // Color basado en nivel de residuos
    const intensity = cell.wasteLevel / 5
    return `rgba(220, 38, 38, ${0.2 + intensity * 0.6})`
  }

  return (
    <div className="ambiental-challenge">
      <button
        className="close-button"
        onClick={() => window.history.back()}
        title="Volver al menú principal"
      >
        ✕
      </button>

      {currentPhase === "instructions" && (
        <motion.div
          key="instructions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="instructions-phase"
        >
          <div className="ambiental-header">
            <Leaf size={48} className="ambiental-icon" />
            <h2>Guardián del Ecosistema IA</h2>
            <p className="ambiental-subtitle">
              Optimiza la recolección de residuos y monitoreo ambiental usando
              IA
            </p>
          </div>

          <div className="instructions-content">
            <div className="instruction-card">
              <MapPin className="instruction-icon" />
              <h3>Instalar Sensores</h3>
              <p>
                Coloca sensores ambientales en ubicaciones estratégicas para
                monitorear en tiempo real los niveles de contaminación y
                residuos
              </p>
            </div>

            <div className="instruction-card">
              <Truck className="instruction-icon" />
              <h3>Planificar Rutas</h3>
              <p>
                Diseña rutas eficientes para la recolección de residuos
                conectando áreas con altos niveles de manera estratégica
              </p>
            </div>

            <div className="instruction-card">
              <Brain className="instruction-icon" />
              <h3>Optimizar con IA</h3>
              <p>
                Usa inteligencia artificial para maximizar la eficiencia del
                sistema y minimizar el consumo energético
              </p>
            </div>
          </div>

          <div className="challenge-selection">
            <h3>Información del Desafío</h3>
            <div className="challenge-info">
              <div className="info-card">
                <div className="info-header">
                  <div className="info-icon">
                    <Zap size={24} />
                  </div>
                  <div className="info-title">
                    <h4>Sistema de Puntuación</h4>
                    <p>Cómo se evalúa tu estrategia</p>
                  </div>
                </div>
                <div className="info-content">
                  <div className="scoring-breakdown">
                    <div className="score-item">
                      <span className="score-label">
                        Eficiencia de Recolección:
                      </span>
                      <span className="score-value">40%</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">
                        Optimización Energética:
                      </span>
                      <span className="score-value">30%</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">
                        Colocación de Sensores:
                      </span>
                      <span className="score-value">30%</span>
                    </div>
                  </div>
                  <div className="bonus-info">
                    <strong>Bonus:</strong> +15 pts por usar 6 sensores y 8
                    rutas completas
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="start-options">
            <button
              className="start-ambiental-btn primary"
              onClick={() => setCurrentPhase("planning")}
            >
              <Leaf size={20} />
              Iniciar Planificación Ambiental
            </button>
            <button
              className="start-ambiental-btn secondary"
              onClick={() => {
                setCurrentPhase("planning");
                setTimeout(useAIOptimization, 500);
              }}
            >
              <Brain size={20} />
              Ver Solución IA Optimizada
            </button>
          </div>
        </motion.div>
      )}

      {currentPhase === "planning" && (
        <motion.div
          key="planning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="planning-phase"
        >
          <div className="planning-workspace">
            <div className="control-palette">
              <h4>Herramientas de Control</h4>
              <div className="control-options">
                <div className="control-section">
                  <div className="section-header">
                    <MapPin size={20} />
                    <h5>Sensores Ambientales ({sensors.length}/6)</h5>
                  </div>
                  <p>Monitorean contaminación en tiempo real</p>
                  <div className="control-instructions">
                    <span>� Click izquierdo en el mapa para colocar</span>
                    <span>🎯 Coloca en zonas rojas (alta contaminación)</span>
                    <span>📊 Máximo 6 sensores disponibles</span>
                  </div>
                </div>

                <div className="control-section">
                  <div className="section-header">
                    <Truck size={20} />
                    <h5>Rutas de Recolección ({routes.length}/8)</h5>
                  </div>
                  <p>Optimizan la recolección de residuos</p>
                  <div className="control-instructions">
                    <span>💡 Click derecho en el mapa para agregar</span>
                    <span>🎯 Conecta áreas con altos residuos</span>
                    <span>📊 Máximo 8 paradas de ruta</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="environmental-map">
              {cityMap.length === 0 ? (
                <div className="empty-map">
                  <Leaf size={48} />
                  <p>Generando mapa de la ciudad...</p>
                </div>
              ) : (
                <div className="city-map-container">
                  {/* Banner con contadores y botones */}
                  <div className="environmental-banner">
                    <div className="counters-section">
                      <div className="counter-item">
                        <Cpu className="counter-icon" size={20} />
                        <span className="counter-label">Sensores:</span>
                        <span className="counter-value">
                          {sensors.length}/6
                        </span>
                      </div>
                      <div className="counter-item">
                        <Navigation className="counter-icon" size={20} />
                        <span className="counter-label">Rutas:</span>
                        <span className="counter-value">{routes.length}/8</span>
                      </div>
                    </div>

                    <div className="banner-controls">
                      <button
                        className="sim-btn ai-optimize"
                        onClick={useAIOptimization}
                      >
                        <Zap size={16} />
                        Optimizar con IA
                      </button>
                      <button
                        className="sim-btn start"
                        onClick={runSimulation}
                        disabled={sensors.length === 0 || routes.length === 0}
                      >
                        <Play size={16} />
                        Simular
                      </button>
                      <button
                        className="sim-btn reset"
                        onClick={resetChallenge}
                      >
                        <RotateCcw size={16} />
                        Reiniciar
                      </button>
                    </div>
                  </div>
                  <div className="map-legend">
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ background: "rgba(220, 38, 38, 0.8)" }}
                      ></div>
                      <span>Alto nivel de residuos</span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ background: "#3B82F6" }}
                      ></div>
                      <span>Sensor instalado</span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ background: "#F59E0B" }}
                      ></div>
                      <span>Ruta planificada</span>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ background: "#22C55E" }}
                      ></div>
                      <span>Residuos recolectados</span>
                    </div>
                  </div>

                  <div className="city-map">
                    {cityMap.map((cell) => (
                      <div
                        key={cell.id}
                        className={`map-cell ${
                          cell.hasSensor ? "has-sensor" : ""
                        } ${cell.isInRoute ? "in-route" : ""} ${
                          cell.collected ? "collected" : ""
                        }`}
                        style={{ backgroundColor: getCellColor(cell) }}
                        onClick={() => placeSensor(cell.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          toggleRoutePoint(cell.id);
                        }}
                        title={`Residuos: ${cell.wasteLevel}/5, Contaminación: ${cell.pollution}/4`}
                      >
                        {cell.hasSensor && (
                          <MapPin size={18} className="sensor-icon" />
                        )}
                        {cell.isInRoute && !cell.collected && (
                          <div className="route-number">
                            {routes.indexOf(cell.id) + 1}
                          </div>
                        )}
                        {cell.collected && (
                          <CheckCircle size={14} className="collected-icon" />
                        )}
                        <div className="waste-indicator">
                          {Array.from({ length: cell.wasteLevel }, (_, i) => (
                            <div key={i} className="waste-dot" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {currentPhase === "simulation" && (
        <motion.div
          className="simulation-phase"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="simulation-content">
            {/* Panel izquierdo: Estadísticas y progreso */}
            <div className="simulation-left-panel">
              <div className="simulation-stats-panel">
                <h3>Estado de la Simulación</h3>

                <div className="sim-stats-grid">
                  <div className="sim-stat">
                    <MapPin className="sim-icon" />
                    <div className="sim-info">
                      <div className="sim-value">{sensors.length}/6</div>
                      <div className="sim-label">Sensores Activos</div>
                    </div>
                  </div>
                  <div className="sim-stat">
                    <Truck className="sim-icon" />
                    <div className="sim-info">
                      <div className="sim-value">{routes.length}/8</div>
                      <div className="sim-label">Rutas Planificadas</div>
                    </div>
                  </div>
                  <div className="sim-stat">
                    <Zap className="sim-icon" />
                    <div className="sim-info">
                      <div className="sim-value">{efficiency}%</div>
                      <div className="sim-label">Eficiencia Total</div>
                    </div>
                  </div>
                  <div className="sim-stat">
                    <CheckCircle className="sim-icon" />
                    <div className="sim-info">
                      <div className="sim-value">
                        {cityMap.filter((c) => c.collected).length}
                      </div>
                      <div className="sim-label">Celdas Procesadas</div>
                    </div>
                  </div>
                </div>

                <div className="simulation-progress">
                  <h4>Progreso de Simulación</h4>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          routes.length > 0
                            ? (cityMap.filter((c) => c.collected).length /
                                routes.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p>
                    {routes.length > 0
                      ? Math.round(
                          (cityMap.filter((c) => c.collected).length /
                            routes.length) *
                            100
                        )
                      : 0}
                    % Completado
                  </p>
                </div>

                <div className="simulation-metrics">
                  <h4>Métricas en Tiempo Real</h4>
                  <div className="metrics-list">
                    <div className="metric-item">
                      <span className="metric-label">Energía Consumida:</span>
                      <span className="metric-value">
                        {Math.round(energyUsed)} kWh
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">
                        Residuos Recolectados:
                      </span>
                      <span className="metric-value">{wasteCollected} kg</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Área Monitoreada:</span>
                      <span className="metric-value">
                        {Math.round((sensors.length / 6) * 100)}%
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Puntuación Actual:</span>
                      <span className="metric-value score-highlight">
                        {score} pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Panel de resultados cuando la simulación esté completa */}
                {simulationComplete && (
                  <div className="simulation-results">
                    <h4>¡Simulación Completada!</h4>
                    <div className="completion-summary">
                      <div className="final-score-display">
                        <div className="score-circle">
                          <span className="score-value">{score}</span>
                          <span className="score-label">pts</span>
                        </div>
                        <p className="efficiency-text">
                          Eficiencia: {efficiency}%
                        </p>
                      </div>

                      <div className="completion-actions">
                        <button
                          className="view-results-button"
                          onClick={goToResults}
                        >
                          <Leaf size={20} />
                          Ver Resultados Detallados
                        </button>
                        <button
                          className="restart-simulation-button"
                          onClick={resetChallenge}
                        >
                          <RefreshCw size={20} />
                          Intentar de Nuevo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Panel derecho: Mapa de la ciudad */}
            <div className="simulation-right-panel">
              <div className="simulation-map-container">
                <motion.div
                  className="simulation-header-inline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="simulation-title">
                    <Zap size={32} className="simulation-icon-inline" />
                    <div>
                      <h2>Simulación en Progreso</h2>
                      <p>
                        La IA está optimizando el plan de recolección y
                        monitoreo ambiental...
                      </p>
                    </div>
                  </div>
                </motion.div>

                <h3>Mapa de Operaciones</h3>

                <div className="map-legend">
                  <div className="legend-item">
                    <div
                      className="legend-color"
                      style={{ background: "#FF6B6B" }}
                    ></div>
                    <span>Alta Contaminación</span>
                  </div>
                  <div className="legend-item">
                    <div
                      className="legend-color"
                      style={{ background: "#4ECDC4" }}
                    ></div>
                    <span>Baja Contaminación</span>
                  </div>
                  <div className="legend-item">
                    <MapPin size={14} />
                    <span>Sensor</span>
                  </div>
                  <div className="legend-item">
                    <div className="route-indicator">1</div>
                    <span>Ruta</span>
                  </div>
                  <div className="legend-item">
                    <CheckCircle size={14} />
                    <span>Procesado</span>
                  </div>
                </div>

                <div className="city-map simulation-map">
                  {cityMap.map((cell) => (
                    <div
                      key={cell.id}
                      className={`map-cell ${
                        cell.hasSensor ? "has-sensor" : ""
                      } ${cell.isInRoute ? "in-route" : ""} ${
                        cell.collected ? "collected" : ""
                      }`}
                      style={{ backgroundColor: getCellColor(cell) }}
                    >
                      {cell.hasSensor && (
                        <MapPin size={18} className="sensor-icon" />
                      )}
                      {cell.collected && (
                        <CheckCircle size={18} className="collected-icon" />
                      )}
                      {cell.isInRoute && !cell.collected && (
                        <span className="route-number">
                          {routes.indexOf(cell.id) + 1}
                        </span>
                      )}
                      <div className="waste-indicator">
                        {Array.from(
                          { length: cell.wasteLevel || 0 },
                          (_, i) => (
                            <div key={i} className="waste-dot" />
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {currentPhase === "results" && (
        <motion.div
          className="results-phase"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="results-card">
            <div className="results-header">
              <Leaf size={64} className="results-icon" />
              <h2>Misión Ambiental Completada</h2>
              <p>Tu sistema de IA ha optimizado la recolección de residuos</p>
            </div>

            <div className="efficiency-display">
              <div className="efficiency-circle">
                <span className="efficiency-value">{efficiency}%</span>
                <span className="efficiency-label">Eficiencia</span>
              </div>
            </div>

            <div className="results-metrics">
              <div className="metric">
                <div className="metric-icon">
                  <Truck size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{wasteCollected} kg</span>
                  <span className="metric-label">Residuos Recolectados</span>
                </div>
              </div>
              <div className="metric">
                <div className="metric-icon">
                  <Zap size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{energyUsed} kWh</span>
                  <span className="metric-label">Energía Utilizada</span>
                </div>
              </div>
              <div className="metric">
                <div className="metric-icon">
                  <MapPin size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{sensors.length}</span>
                  <span className="metric-label">Sensores Activos</span>
                </div>
              </div>
            </div>

            <div className="environmental-impact">
              <h3>Impacto Ambiental</h3>
              <div className="impact-stats">
                <div className="impact-item">
                  <span className="impact-label">Reducción de CO₂:</span>
                  <span className="impact-value">
                    {Math.round(wasteCollected * 0.1)} kg
                  </span>
                </div>
                <div className="impact-item">
                  <span className="impact-label">Áreas Monitoreadas:</span>
                  <span className="impact-value">{sensors.length * 12}%</span>
                </div>
                <div className="impact-item">
                  <span className="impact-label">Eficiencia de Rutas:</span>
                  <span className="impact-value">
                    {Math.max(0, 100 - energyUsed / 2)}%
                  </span>
                </div>
              </div>
            </div>

            <button className="retry-button" onClick={resetChallenge}>
              <RefreshCw size={20} />
              Optimizar Nuevamente
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AmbientalChallenge
