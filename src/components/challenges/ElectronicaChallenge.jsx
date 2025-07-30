import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Play, 
  RefreshCw, 
  Power,
  Lightbulb,
  Settings,
  CheckCircle,
  Award,
  Brain,
  Cpu,
  Radio,
  Target,
  RotateCcw,
  ArrowRight
} from 'lucide-react'
import './ElectronicaChallenge.css'

const ElectronicaChallenge = ({ onComplete, onScoreChange }) => {
  const [currentPhase, setCurrentPhase] = useState('instructions') // instructions, tutorial, building, programming, testing, results
  const [circuit, setCircuit] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResults, setSimulationResults] = useState([])
  const [score, setScore] = useState(0)
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [draggedComponent, setDraggedComponent] = useState(null)
  const canvasRef = useRef(null)

  // Componentes disponibles para el circuito
  const components = {
    sensors: [
      { 
        id: 'light_sensor', 
        name: 'Sensor de Luz', 
        icon: '💡', 
        type: 'input',
        description: 'Detecta niveles de luminosidad',
        outputs: ['light_level'],
        aiFeature: 'auto_calibration'
      },
      { 
        id: 'motion_sensor', 
        name: 'Sensor de Movimiento', 
        icon: '👋', 
        type: 'input',
        description: 'Detecta movimiento cercano',
        outputs: ['motion_detected'],
        aiFeature: 'pattern_recognition'
      },
      { 
        id: 'temp_sensor', 
        name: 'Sensor de Temperatura', 
        icon: '🌡️', 
        type: 'input',
        description: 'Mide temperatura ambiente',
        outputs: ['temperature'],
        aiFeature: 'predictive_monitoring'
      }
    ],
    actuators: [
      { 
        id: 'led', 
        name: 'LED', 
        icon: '💡', 
        type: 'output',
        description: 'Luz LED controlable',
        inputs: ['power'],
        aiFeature: 'adaptive_brightness'
      },
      { 
        id: 'motor', 
        name: 'Motor', 
        icon: '⚙️', 
        type: 'output',
        description: 'Motor servo controlable',
        inputs: ['speed', 'direction'],
        aiFeature: 'smart_control'
      },
      { 
        id: 'buzzer', 
        name: 'Buzzer', 
        icon: '🔊', 
        type: 'output',
        description: 'Sonido de alerta',
        inputs: ['frequency'],
        aiFeature: 'adaptive_volume'
      }
    ],
    logic: [
      { 
        id: 'ai_processor', 
        name: 'Procesador IA', 
        icon: '🧠', 
        type: 'processor',
        description: 'Unidad de procesamiento inteligente',
        inputs: ['sensor_data'],
        outputs: ['control_signals'],
        aiFeature: 'machine_learning'
      },
      { 
        id: 'condition_block', 
        name: 'Bloque Condicional', 
        icon: '🔀', 
        type: 'logic',
        description: 'Lógica if-then-else',
        inputs: ['condition'],
        outputs: ['true_path', 'false_path'],
        aiFeature: 'fuzzy_logic'
      },
      { 
        id: 'timer_block', 
        name: 'Temporizador', 
        icon: '⏰', 
        type: 'logic',
        description: 'Control temporal inteligente',
        inputs: ['trigger'],
        outputs: ['timed_signal'],
        aiFeature: 'adaptive_timing'
      }
    ]
  }

  // Desafíos progresivos
  const challenges = [
    {
      id: 1,
      title: 'Luz Automática Inteligente',
      description: 'Crea un sistema que encienda una luz automáticamente cuando detecte poca luminosidad',
      objective: 'Conectar sensor de luz → Procesador IA → LED',
      requiredComponents: ['light_sensor', 'ai_processor', 'led'],
      difficulty: 'Fácil',
      points: 25
    },
    {
      id: 2,
      title: 'Sistema de Seguridad Inteligente',
      description: 'Diseña un sistema que active una alarma cuando detecte movimiento',
      objective: 'Sensor de movimiento → Lógica condicional → Buzzer',
      requiredComponents: ['motion_sensor', 'condition_block', 'buzzer'],
      difficulty: 'Medio',
      points: 35
    },
    {
      id: 3,
      title: 'Control Climático Adaptivo',
      description: 'Crea un sistema que controle un ventilador basado en temperatura',
      objective: 'Sensor temperatura → IA + Timer → Motor',
      requiredComponents: ['temp_sensor', 'ai_processor', 'timer_block', 'motor'],
      difficulty: 'Avanzado',
      points: 40
    }
  ]

  useEffect(() => {
    onScoreChange(score)
  }, [score, onScoreChange])

  const startChallenge = (challengeIndex) => {
    setCurrentChallenge(challengeIndex)
    setCircuit([])
    setCurrentPhase('building')
  }

  const addComponentToCircuit = (component, position) => {
    const newComponent = {
      ...component,
      id: `${component.id}_${Date.now()}`,
      position: position || { x: 100 + circuit.length * 120, y: 200 },
      connections: [],
      properties: {},
      state: 'inactive'
    }
    setCircuit([...circuit, newComponent])
  }

  const connectComponents = (fromComponent, fromOutput, toComponent, toInput) => {
    const newCircuit = [...circuit]
    const fromComp = newCircuit.find(c => c.id === fromComponent.id)
    const toComp = newCircuit.find(c => c.id === toComponent.id)
    
    if (fromComp && toComp) {
      fromComp.connections.push({
        to: toComponent.id,
        fromOutput,
        toInput
      })
    }
    
    setCircuit(newCircuit)
  }

  const simulateCircuit = async () => {
    setIsSimulating(true)
    setCurrentPhase('testing')
    
    // Simulación de comportamiento del circuito
    const results = []
    
    for (let step = 0; step < 10; step++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simular comportamiento de sensores
      const sensorData = generateSensorData(step)
      
      // Simular procesamiento IA
      const aiDecisions = processWithAI(sensorData)
      
      // Simular respuesta de actuadores
      const actuatorStates = updateActuators(aiDecisions)
      
      results.push({
        step: step + 1,
        sensors: sensorData,
        ai: aiDecisions,
        actuators: actuatorStates,
        timestamp: Date.now()
      })
      
      setSimulationResults([...results])
    }
    
    setIsSimulating(false)
    evaluateCircuit(results)
  }

  const generateSensorData = (step) => {
    const data = {}
    
    circuit.forEach(component => {
      if (component.type === 'input') {
        switch (component.name) {
          case 'Sensor de Luz':
            data.light_level = 30 + Math.sin(step * 0.5) * 40 + Math.random() * 10
            break
          case 'Sensor de Movimiento':
            data.motion_detected = Math.random() > 0.7
            break
          case 'Sensor de Temperatura':
            data.temperature = 22 + Math.sin(step * 0.3) * 5 + Math.random() * 2
            break
        }
      }
    })
    
    return data
  }

  const processWithAI = (sensorData) => {
    const decisions = {}
    const challenge = challenges[currentChallenge]
    
    // Simulación de lógica IA basada en el desafío actual
    switch (challenge.id) {
      case 1: // Luz automática
        decisions.light_control = sensorData.light_level < 40 ? 'on' : 'off'
        decisions.brightness = Math.max(0, 100 - sensorData.light_level)
        break
      case 2: // Sistema de seguridad
        decisions.alarm = sensorData.motion_detected ? 'active' : 'inactive'
        decisions.alert_level = sensorData.motion_detected ? 'high' : 'low'
        break
      case 3: // Control climático
        decisions.fan_speed = Math.max(0, (sensorData.temperature - 24) * 20)
        decisions.climate_mode = sensorData.temperature > 26 ? 'cooling' : 'normal'
        break
    }
    
    return decisions
  }

  const updateActuators = (aiDecisions) => {
    const states = {}
    
    circuit.forEach(component => {
      if (component.type === 'output') {
        switch (component.name) {
          case 'LED':
            states.led = {
              active: aiDecisions.light_control === 'on',
              brightness: aiDecisions.brightness || 50
            }
            break
          case 'Motor':
            states.motor = {
              active: aiDecisions.fan_speed > 0,
              speed: aiDecisions.fan_speed || 0
            }
            break
          case 'Buzzer':
            states.buzzer = {
              active: aiDecisions.alarm === 'active',
              frequency: aiDecisions.alert_level === 'high' ? 1000 : 500
            }
            break
        }
      }
    })
    
    return states
  }

  const evaluateCircuit = (results) => {
    const challenge = challenges[currentChallenge]
    let challengeScore = 0
    
    // Evaluar si el circuito tiene los componentes requeridos
    const hasRequiredComponents = challenge.requiredComponents.every(reqComp =>
      circuit.some(comp => comp.id.startsWith(reqComp))
    )
    
    if (hasRequiredComponents) {
      challengeScore += challenge.points * 0.5 // 50% por componentes correctos
    }
    
    // Evaluar funcionamiento correcto
    const workingCorrectly = evaluateLogic(results, challenge)
    if (workingCorrectly) {
      challengeScore += challenge.points * 0.5 // 50% por funcionamiento
    }
    
    // Bonus por eficiencia del diseño
    const efficiency = calculateEfficiency()
    challengeScore += efficiency * 5
    
    const newCompletedChallenges = [...completedChallenges]
    if (!newCompletedChallenges.includes(currentChallenge)) {
      newCompletedChallenges.push(currentChallenge)
      setCompletedChallenges(newCompletedChallenges)
    }
    
    const newScore = score + Math.round(challengeScore)
    setScore(newScore)
    setCurrentPhase('results')
  }

  const evaluateLogic = (results, challenge) => {
    // Lógica de evaluación específica por desafío
    switch (challenge.id) {
      case 1:
        return results.some(r => r.ai.light_control === 'on' && r.sensors.light_level < 40)
      case 2:
        return results.some(r => r.ai.alarm === 'active' && r.sensors.motion_detected)
      case 3:
        return results.some(r => r.ai.fan_speed > 0 && r.sensors.temperature > 25)
      default:
        return true
    }
  }

  const calculateEfficiency = () => {
    // Calcular eficiencia basada en número de componentes vs requeridos
    const challenge = challenges[currentChallenge]
    const excess = circuit.length - challenge.requiredComponents.length
    return Math.max(0, 10 - excess * 2)
  }

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      startChallenge(currentChallenge + 1)
    } else {
      completeAllChallenges()
    }
  }

  const completeAllChallenges = () => {
    const finalScore = score + (completedChallenges.length * 10) // Bonus por completar múltiples desafíos
    setScore(finalScore)
    onComplete(finalScore)
  }

  const resetChallenge = () => {
    setCircuit([])
    setSimulationResults([])
    setCurrentPhase('building')
  }

  return (
    <div className="electronica-challenge">
      {/* Fase de Instrucciones */}
      {currentPhase === 'instructions' && (
        <motion.div 
          className="instructions-phase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="phase-header">
            <Zap size={48} className="phase-icon" />
            <h2>El Circuit Maker Inteligente</h2>
            <p>Construye circuitos que reaccionan con sensores inteligentes y lógica de IA</p>
          </div>

          <div className="instructions-content">
            <div className="instruction-steps">
              <div className="step">
                <Cpu className="step-icon" />
                <h3>1. Selecciona y Arrastra</h3>
                <p>Elige componentes del panel izquierdo: sensores (🔍), actuadores (⚡) y lógica IA (🧠). Haz clic o arrastra al área de diseño para construir tu circuito inteligente.</p>
              </div>
              <div className="step">
                <Brain className="step-icon" />
                <h3>2. Conecta con IA</h3>
                <p>Los componentes se conectan automáticamente en secuencia. Cada uno tiene características de IA únicas como auto-calibración, reconocimiento de patrones y control adaptativo.</p>
              </div>
              <div className="step">
                <Play className="step-icon" />
                <h3>3. Simula y Observa</h3>
                <p>Presiona "Simular" para ver tu circuito en acción. Observa cómo los sensores captan datos, la IA toma decisiones y los actuadores responden automáticamente.</p>
              </div>
            </div>

            <div className="challenges-overview">
              <h3>🎯 Elige tu Misión de Circuitos Inteligentes</h3>
              <div className="challenges-grid">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    className={`challenge-card ${completedChallenges.includes(index) ? 'completed' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => startChallenge(index)}
                  >
                    <div className="challenge-header">
                      <h4>{challenge.title}</h4>
                      <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p>{challenge.description}</p>
                    <div className="challenge-objective">
                      <strong>🎯 Tu Misión:</strong> {challenge.objective}
                    </div>
                    <div className="challenge-footer">
                      <span className="points">🏆 +{challenge.points} puntos</span>
                      {completedChallenges.includes(index) && (
                        <CheckCircle className="completed-icon" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fase de Construcción */}
      {currentPhase === 'building' && (
        <motion.div 
          className="building-phase"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="phase-header">
            <Settings size={36} className="phase-icon" />
            <h3>Construyendo: {challenges[currentChallenge].title}</h3>
            <div className="challenge-progress">
              Desafío {currentChallenge + 1} de {challenges.length}
            </div>
          </div>

          <div className="building-workspace">
            <div className="components-panel">
              <h4>🔧 Caja de Herramientas</h4>
              
              <div className="component-category">
                <h5>🔍 Sensores Inteligentes</h5>
                <div className="component-list">
                  {components.sensors.map(component => (
                    <motion.div
                      key={component.id}
                      className="component-item"
                      whileHover={{ scale: 1.05 }}
                      draggable
                      onDragStart={() => setDraggedComponent(component)}
                      onClick={() => addComponentToCircuit(component)}
                    >
                      <div className="component-icon">{component.icon}</div>
                      <div className="component-info">
                        <span className="component-name">{component.name}</span>
                        <span className="component-ai">✨ {component.aiFeature.replace('_', ' ')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="component-category">
                <h5>⚡ Actuadores Inteligentes</h5>
                <div className="component-list">
                  {components.actuators.map(component => (
                    <motion.div
                      key={component.id}
                      className="component-item"
                      whileHover={{ scale: 1.05 }}
                      draggable
                      onDragStart={() => setDraggedComponent(component)}
                      onClick={() => addComponentToCircuit(component)}
                    >
                      <div className="component-icon">{component.icon}</div>
                      <div className="component-info">
                        <span className="component-name">{component.name}</span>
                        <span className="component-ai">✨ {component.aiFeature.replace('_', ' ')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="component-category">
                <h5>🧠 Procesadores IA</h5>
                <div className="component-list">
                  {components.logic.map(component => (
                    <motion.div
                      key={component.id}
                      className="component-item"
                      whileHover={{ scale: 1.05 }}
                      draggable
                      onDragStart={() => setDraggedComponent(component)}
                      onClick={() => addComponentToCircuit(component)}
                    >
                      <div className="component-icon">{component.icon}</div>
                      <div className="component-info">
                        <span className="component-name">{component.name}</span>
                        <span className="component-ai">✨ {component.aiFeature.replace('_', ' ')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="circuit-canvas">
              <div className="canvas-header">
                <h4>Área de Diseño del Circuito</h4>
                <div className="canvas-controls">
                  <button className="control-btn" onClick={resetChallenge}>
                    <RotateCcw size={16} />
                    Limpiar
                  </button>
                  <button 
                    className="control-btn primary" 
                    onClick={simulateCircuit}
                    disabled={circuit.length === 0}
                  >
                    <Play size={16} />
                    Simular
                  </button>
                </div>
              </div>
              
              <div 
                className="canvas-area"
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggedComponent) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const position = {
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top
                    }
                    addComponentToCircuit(draggedComponent, position)
                    setDraggedComponent(null)
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {circuit.length === 0 ? (
                  <div className="empty-canvas">
                    <Cpu size={64} className="empty-icon" />
                    <p><strong>💡 ¡Comienza aquí!</strong></p>
                    <p>Arrastra componentes desde el panel izquierdo</p>
                    <p className="hint">O haz clic directamente en cualquier componente</p>
                    <p className="hint">🎯 Necesitas: {challenges[currentChallenge].requiredComponents.length} componentes para este desafío</p>
                  </div>
                ) : (
                  <div className="circuit-components">
                    {circuit.map((component, index) => (
                      <motion.div
                        key={component.id}
                        className={`circuit-component ${component.type}`}
                        style={{
                          left: component.position.x,
                          top: component.position.y
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="component-icon">{component.icon}</div>
                        <div className="component-label">{component.name}</div>
                        <div className="component-status">
                          <div className={`status-light ${component.state}`} />
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Líneas de conexión mejoradas */}
                    <svg className="connection-lines" width="100%" height="100%">
                      {circuit.map((component, index) => {
                        if (index < circuit.length - 1) {
                          const nextComponent = circuit[index + 1]
                          return (
                            <line
                              key={`line-${index}`}
                              x1={component.position.x + 70}
                              y1={component.position.y + 40}
                              x2={nextComponent.position.x}
                              y2={nextComponent.position.y + 40}
                              stroke="#60A5FA"
                              strokeWidth="4"
                              strokeDasharray="8,4"
                              style={{
                                filter: 'drop-shadow(0 0 6px rgba(96, 165, 250, 0.6))'
                              }}
                            />
                          )
                        }
                        return null
                      })}
                    </svg>
                  </div>
                )}
              </div>

              <div className="challenge-hint">
                <h5>🎯 Pista para tu Misión:</h5>
                <p>{challenges[currentChallenge].objective}</p>
                <p><strong>Componentes necesarios:</strong> {challenges[currentChallenge].requiredComponents.join(' → ')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fase de Simulación */}
      {currentPhase === 'testing' && (
        <motion.div 
          className="testing-phase"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="phase-header">
            <Radio size={36} className="phase-icon spinning" />
            <h3>Simulando Circuito</h3>
            <p>Observa cómo tu circuito inteligente responde en tiempo real</p>
          </div>

          <div className="simulation-dashboard">
            <div className="sensor-readings">
              <h4>📊 Lecturas de Sensores</h4>
              <div className="sensor-data">
                {simulationResults.length > 0 && simulationResults[simulationResults.length - 1].sensors && 
                  Object.entries(simulationResults[simulationResults.length - 1].sensors).map(([key, value]) => (
                    <div key={key} className="sensor-reading">
                      <span className="sensor-name">{key.replace('_', ' ')}</span>
                      <div className="sensor-value">
                        {typeof value === 'boolean' ? (value ? '✅ SÍ' : '❌ NO') : 
                         typeof value === 'number' ? value.toFixed(1) : value}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="ai-decisions">
              <h4>🧠 Decisiones de IA</h4>
              <div className="ai-data">
                {simulationResults.length > 0 && simulationResults[simulationResults.length - 1].ai && 
                  Object.entries(simulationResults[simulationResults.length - 1].ai).map(([key, value]) => (
                    <div key={key} className="ai-decision">
                      <span className="decision-name">{key.replace('_', ' ')}</span>
                      <div className="decision-value">
                        {typeof value === 'string' ? value : 
                         typeof value === 'number' ? `${value.toFixed(1)}%` : value.toString()}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="actuator-states">
              <h4>⚡ Estado de Actuadores</h4>
              <div className="actuator-data">
                {simulationResults.length > 0 && simulationResults[simulationResults.length - 1].actuators && 
                  Object.entries(simulationResults[simulationResults.length - 1].actuators).map(([key, value]) => (
                    <div key={key} className="actuator-state">
                      <span className="actuator-name">{key.toUpperCase()}</span>
                      <div className={`actuator-indicator ${value.active ? 'active' : 'inactive'}`}>
                        {value.active ? '🟢 ACTIVO' : '🔴 INACTIVO'}
                        {value.brightness && <span> - {value.brightness}%</span>}
                        {value.speed && <span> - {value.speed.toFixed(1)}%</span>}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          <div className="simulation-log">
            <h4>📋 Registro de Simulación</h4>
            <div className="log-entries">
              {simulationResults.slice(-5).map((result, index) => (
                <motion.div
                  key={result.step}
                  className="log-entry"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="step-number">Paso {result.step}</span>
                  <span className="log-description">
                    Sistema funcionando correctamente - IA procesando datos
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {isSimulating && (
            <div className="simulation-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(simulationResults.length / 10) * 100}%` }}
                />
              </div>
              <p>Simulando paso {simulationResults.length} de 10...</p>
            </div>
          )}
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
            <h2>¡Circuito Completado!</h2>
            
            <div className="challenge-results">
              <h3>{challenges[currentChallenge].title}</h3>
              <div className="result-metrics">
                <div className="metric">
                  <Target className="metric-icon" />
                  <span className="metric-label">Funcionalidad</span>
                  <span className="metric-value">✅ Correcto</span>
                </div>
                <div className="metric">
                  <Brain className="metric-icon" />
                  <span className="metric-label">IA Integrada</span>
                  <span className="metric-value">✅ Activa</span>
                </div>
                <div className="metric">
                  <Zap className="metric-icon" />
                  <span className="metric-label">Eficiencia</span>
                  <span className="metric-value">{calculateEfficiency()}/10</span>
                </div>
              </div>
            </div>

            <div className="final-score">
              <span className="score-label">Puntos Obtenidos</span>
              <span className="score-value">+{challenges[currentChallenge].points}</span>
            </div>

            <div className="learned-concepts">
              <h3>Conceptos Aprendidos:</h3>
              <ul>
                <li>✓ Diseño de circuitos inteligentes</li>
                <li>✓ Integración de sensores y actuadores</li>
                <li>✓ Programación de lógica IA</li>
                <li>✓ Simulación de sistemas electrónicos</li>
                <li>✓ Respuesta adaptativa automática</li>
              </ul>
            </div>

            <div className="action-buttons">
              {currentChallenge < challenges.length - 1 ? (
                <button className="next-btn" onClick={nextChallenge}>
                  <ArrowRight size={20} />
                  Siguiente Desafío
                </button>
              ) : (
                <button className="complete-btn" onClick={completeAllChallenges}>
                  <CheckCircle size={20} />
                  Completar Todos los Desafíos
                </button>
              )}
              
              <button className="retry-btn" onClick={resetChallenge}>
                <RotateCcw size={20} />
                Reintentar Desafío
              </button>
              
              <button className="menu-btn" onClick={() => setCurrentPhase('instructions')}>
                Menu Principal
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ElectronicaChallenge
