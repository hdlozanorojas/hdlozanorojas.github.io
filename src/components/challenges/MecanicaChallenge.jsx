import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Play, RefreshCw, Zap, Target, Award, ArrowRight, CheckCircle, RotateCcw } from 'lucide-react'
import ParticleBackground from './ui/ParticleBackground'
import RippleButton from './ui/RippleButton'
import ShimmerCard from './ui/ShimmerCard'
import ProgressBar from './ui/ProgressBar'
import ConfettiAnimation from './ui/ConfettiAnimation'
import Tooltip from './ui/Tooltip'
import './MecanicaChallenge.css'

const MecanicaChallenge = ({ onComplete, onScoreChange }) => {
  const [currentPhase, setCurrentPhase] = useState('instructions')
  const [score, setScore] = useState(0)
  const [robotPosition, setRobotPosition] = useState({ x: 50, y: 50 })
  const [targetPosition, setTargetPosition] = useState({ x: 200, y: 200 })
  const [commands, setCommands] = useState([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [completedTasks, setCompletedTasks] = useState([])
  const [currentTask, setCurrentTask] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [executionProgress, setExecutionProgress] = useState(0)

  const tasks = [
    {
      id: 1,
      title: "Navegación Básica",
      description: "Programa el robot para que alcance el objetivo",
      target: { x: 150, y: 100 },
      maxCommands: 5,
      points: 25
    },
    {
      id: 2,
      title: "Evasión de Obstáculos",
      description: "Navega evitando los obstáculos rojos",
      target: { x: 250, y: 180 },
      obstacles: [{ x: 120, y: 80 }, { x: 180, y: 140 }],
      maxCommands: 8,
      points: 35
    },
    {
      id: 3,
      title: "Recogida de Objetos",
      description: "Recoge todos los objetos azules antes de llegar al objetivo",
      target: { x: 280, y: 200 },
      objects: [{ x: 100, y: 120 }, { x: 200, y: 160 }],
      maxCommands: 10,
      points: 40
    }
  ]

  const availableCommands = [
    { type: 'forward', label: 'Avanzar', icon: '↑', dx: 0, dy: -20 },
    { type: 'backward', label: 'Retroceder', icon: '↓', dx: 0, dy: 20 },
    { type: 'left', label: 'Izquierda', icon: '←', dx: -20, dy: 0 },
    { type: 'right', label: 'Derecha', icon: '→', dx: 20, dy: 0 },
    { type: 'scan', label: 'Escanear', icon: '👁️', action: 'scan' },
    { type: 'grab', label: 'Recoger', icon: '🤏', action: 'grab' }
  ]

  useEffect(() => {
    const newScore = completedTasks.reduce((total, task) => total + task.points, 0)
    setScore(newScore)
    onScoreChange(newScore)
  }, [completedTasks, onScoreChange])

  const addCommand = (command) => {
    if (commands.length < tasks[currentTask]?.maxCommands || 15) {
      setCommands([...commands, command])
    }
  }

  const removeCommand = (index) => {
    setCommands(commands.filter((_, i) => i !== index))
  }

  const executeCommands = async () => {
    setIsExecuting(true)
    setExecutionProgress(0)
    let currentPos = { ...robotPosition }

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      
      // Update progress
      setExecutionProgress(((i + 1) / commands.length) * 100)
      
      // Highlight current command
      const commandElements = document.querySelectorAll('.command-item')
      commandElements.forEach((el, idx) => {
        el.classList.toggle('executing', idx === i)
      })

      await new Promise(resolve => setTimeout(resolve, 800))

      if (command.dx !== undefined && command.dy !== undefined) {
        currentPos = {
          x: Math.max(10, Math.min(290, currentPos.x + command.dx)),
          y: Math.max(10, Math.min(190, currentPos.y + command.dy))
        }
        setRobotPosition(currentPos)
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Clear execution highlighting
    const commandElements = document.querySelectorAll('.command-item')
    commandElements.forEach(el => el.classList.remove('executing'))

    setExecutionProgress(100)
    checkTaskCompletion(currentPos)
    setIsExecuting(false)
  }

  const checkTaskCompletion = (finalPos) => {
    const task = tasks[currentTask]
    const distance = Math.sqrt(
      Math.pow(finalPos.x - task.target.x, 2) + 
      Math.pow(finalPos.y - task.target.y, 2)
    )

    if (distance < 25) {
      // Trigger confetti animation
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 100)
      
      const taskScore = task.points + (commands.length <= task.maxCommands ? 10 : 0)
      setCompletedTasks([...completedTasks, { ...task, points: taskScore }])
      
      if (currentTask < tasks.length - 1) {
        setTimeout(() => {
          setCurrentTask(currentTask + 1)
          setCommands([])
          setExecutionProgress(0)
          resetRobot()
        }, 2000)
      } else {
        setTimeout(() => {
          const finalScore = score + taskScore
          onComplete(finalScore)
        }, 2000)
      }
    }
  }

  const resetRobot = () => {
    setRobotPosition({ x: 50, y: 50 })
    setCommands([])
    setExecutionProgress(0)
  }

  const startChallenge = () => {
    setCurrentPhase('programming')
  }

  if (currentPhase === 'instructions') {
    return (
      <div className="mecanica-challenge">
        <ParticleBackground />
        <ConfettiAnimation trigger={showConfetti} />
        
        <div className="phase-header">
          <motion.div
            className="phase-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Settings size={64} />
          </motion.div>
          <h2>Robots en Acción</h2>
          <p>Programa robots inteligentes para completar misiones complejas</p>
        </div>

        <motion.div 
          className="instructions-phase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ShimmerCard className="instruction-card">
            <div className="card-header">
              <Settings size={48} className="robot-icon" />
              <h2>Control Robótico Inteligente</h2>
              <p>Aprende a programar robots autónomos con algoritmos de IA</p>
            </div>

            <div className="instruction-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Analiza la Misión</h3>
                  <p>Observa el objetivo, obstáculos y elementos del entorno</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Programa los Comandos</h3>
                  <p>Crea una secuencia lógica de movimientos y acciones</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Ejecuta y Optimiza</h3>
                  <p>Observa el comportamiento y mejora tu algoritmo</p>
                </div>
              </div>
            </div>

            <div className="start-options">
              <RippleButton 
                variant="primary"
                onClick={startChallenge}
              >
                <Play size={20} />
                Iniciar Programación
              </RippleButton>
            </div>
          </ShimmerCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mecanica-challenge">
      <ParticleBackground />
      <ConfettiAnimation trigger={showConfetti} />
      
      <div className="phase-header">
        <Zap size={48} className="phase-icon" />
        <h2>Programación Robótica</h2>
        <p>Misión {currentTask + 1} de {tasks.length}: {tasks[currentTask]?.title}</p>
        
        {/* Progress bar for execution */}
        {isExecuting && (
          <div className="execution-progress">
            <ProgressBar 
              progress={executionProgress} 
              max={100}
              color="primary"
              animated={true}
            />
          </div>
        )}
      </div>

      <div className="programming-phase">
        <div className="task-info">
          <ShimmerCard 
            className="task-card"
            isActive={isExecuting}
          >
            <h3>{tasks[currentTask]?.title}</h3>
            <p>{tasks[currentTask]?.description}</p>
            <div className="task-constraints">
              <span>Comandos máximos: {tasks[currentTask]?.maxCommands}</span>
              <span>Puntos: {tasks[currentTask]?.points}</span>
            </div>
          </ShimmerCard>
        </div>

        <div className="workspace">
          <ShimmerCard className="command-panel">
            <h3>🎮 Comandos Disponibles</h3>
            <div className="available-commands">
              {availableCommands.map((cmd, index) => (
                <Tooltip 
                  key={index}
                  content={`${cmd.label} - ${cmd.type === 'forward' ? 'Mueve hacia arriba' : 
                            cmd.type === 'backward' ? 'Mueve hacia abajo' :
                            cmd.type === 'left' ? 'Mueve hacia la izquierda' :
                            cmd.type === 'right' ? 'Mueve hacia la derecha' :
                            cmd.type === 'scan' ? 'Escanea el entorno' :
                            'Recoge objetos'}`}
                  position="top"
                  delay={500}
                >
                  <motion.button
                    className="command-btn"
                    onClick={() => addCommand(cmd)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isExecuting}
                  >
                    <span className="cmd-icon">{cmd.icon}</span>
                    <span className="cmd-label">{cmd.label}</span>
                  </motion.button>
                </Tooltip>
              ))}
            </div>

            <div className="command-sequence">
              <h3>📝 Secuencia de Comandos ({commands.length}/{tasks[currentTask]?.maxCommands || 15})</h3>
              <div className="commands-list">
                {commands.map((cmd, index) => (
                  <motion.div 
                    key={index} 
                    className="command-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="cmd-icon">{cmd.icon}</span>
                    <span className="cmd-name">{cmd.label}</span>
                    <button 
                      className="remove-cmd"
                      onClick={() => removeCommand(index)}
                      disabled={isExecuting}
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="execution-controls">
              <RippleButton
                variant="secondary"
                onClick={executeCommands}
                disabled={isExecuting || commands.length === 0}
              >
                <Play size={20} />
                {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
              </RippleButton>

              <RippleButton
                variant="danger"
                onClick={resetRobot}
                disabled={isExecuting}
              >
                <RotateCcw size={20} />
                Reiniciar
              </RippleButton>
            </div>
          </ShimmerCard>

          <div className="simulation-area">
            <h3>🤖 Simulación Robótica</h3>
            <div className="robot-arena">
              {/* Grid background */}
              <div className="grid-background"></div>
              
              {/* Robot */}
              <motion.div
                className="robot"
                style={{
                  left: robotPosition.x,
                  top: robotPosition.y
                }}
                animate={{
                  scale: isExecuting ? [1, 1.1, 1] : 1
                }}
                transition={{
                  duration: 0.5,
                  repeat: isExecuting ? Infinity : 0
                }}
              >
                🤖
              </motion.div>

              {/* Target */}
              <div
                className="target"
                style={{
                  left: tasks[currentTask]?.target.x,
                  top: tasks[currentTask]?.target.y
                }}
              >
                🎯
              </div>

              {/* Obstacles */}
              {tasks[currentTask]?.obstacles?.map((obstacle, index) => (
                <div
                  key={index}
                  className="obstacle"
                  style={{
                    left: obstacle.x,
                    top: obstacle.y
                  }}
                >
                  🔴
                </div>
              ))}

              {/* Objects to collect */}
              {tasks[currentTask]?.objects?.map((object, index) => (
                <div
                  key={index}
                  className="collectible"
                  style={{
                    left: object.x,
                    top: object.y
                  }}
                >
                  💎
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="progress-panel">
          <div className="score-display">
            <Award size={24} />
            <span>Puntuación: {score}</span>
          </div>
          
          <div className="tasks-progress">
            {tasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`task-indicator ${index === currentTask ? 'current' : ''} ${completedTasks.find(t => t.id === task.id) ? 'completed' : ''}`}
              >
                {completedTasks.find(t => t.id === task.id) ? <CheckCircle size={16} /> : index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MecanicaChallenge
