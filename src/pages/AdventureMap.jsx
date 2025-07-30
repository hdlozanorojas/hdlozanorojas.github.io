import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Brain, 
  Leaf, 
  Factory, 
  Zap, 
  Cog, 
  Microscope, 
  BarChart3,
  User,
  Users,
  Home,
  Trophy,
  Star
} from 'lucide-react'
import { useGame } from '../context/GameContext'
import './AdventureMap.css'

// Componente ProgressBar simple inline
const ProgressBar = ({ progress, height = '8px', color = '#4F46E5' }) => (
  <div style={{
    width: '100%',
    height,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden'
  }}>
    <div style={{
      width: `${Math.min(Math.max(progress, 0), 100)}%`,
      height: '100%',
      backgroundColor: color,
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    }} />
  </div>
)

const AdventureMap = () => {
  const navigate = useNavigate()
  const { user, challenges, visitProgram, completeChallenge } = useGame()
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [hoveredProgram, setHoveredProgram] = useState(null)

  const programs = [
    {
      id: 'sistemas',
      name: 'Ingeniería de Sistemas',
      shortName: 'El Entrenador de Robots',
      icon: Brain,
      description: 'Entrena modelos de IA para reconocimiento de patrones',
      color: '#4F46E5',
      position: { x: 15, y: 20 },
      difficulty: 'Fácil'
    },
    {
      id: 'ambiental',
      name: 'Ingeniería Ambiental',
      shortName: 'El Guardián del Ecosistema',
      icon: Leaf,
      description: 'Optimiza la recolección de residuos con IA',
      color: '#059669',
      position: { x: 75, y: 15 },
      difficulty: 'Medio'
    },
    {
      id: 'industrial',
      name: 'Ingeniería Industrial',
      shortName: 'Optimizador de Fábrica',
      icon: Factory,
      description: 'Diseña la fábrica del futuro más eficiente',
      color: '#DC2626',
      position: { x: 20, y: 60 },
      difficulty: 'Medio'
    },
    {
      id: 'electronica',
      name: 'Ingeniería Electrónica',
      shortName: 'Circuit Maker Inteligente',
      icon: Zap,
      description: 'Construye circuitos que reaccionan con IA',
      color: '#F59E0B',
      position: { x: 80, y: 70 },
      difficulty: 'Avanzado'
    },
    {
      id: 'mecanica',
      name: 'Ingeniería Mecánica',
      shortName: 'Robots en Acción',
      icon: Cog,
      description: 'Programa robots para realizar tareas complejas',
      color: '#7C3AED',
      position: { x: 50, y: 45 },
      difficulty: 'Avanzado'
    },
    {
      id: 'biologia',
      name: 'Biología',
      shortName: 'Bio-Detective de IA',
      icon: Microscope,
      description: 'Clasifica especies y diagnostica con IA',
      color: '#EC4899',
      position: { x: 25, y: 85 },
      difficulty: 'Fácil'
    },
    {
      id: 'datos',
      name: 'Ciencias de Datos',
      shortName: 'El Predictor Inteligente',
      icon: BarChart3,
      description: 'Predice tendencias usando análisis de datos',
      color: '#0891B2',
      position: { x: 70, y: 30 },
      difficulty: 'Medio'
    }
  ]

  const handleProgramClick = (program) => {
    setSelectedProgram(program)
    // Registrar que el usuario visitó este programa
    visitProgram(program.id)
  }

  const handleStartChallenge = () => {
    if (selectedProgram) {
      navigate(`/desafio/${selectedProgram.id}`)
    }
  }

  const completedCount = user.progress.completedChallenges.length
  const totalProgress = (completedCount / programs.length) * 100

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  }

  const programVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  return (
    <div className="adventure-map">
      {/* Header */}
      <motion.header 
        className="map-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="user-info">
            <User className="user-icon" />
            <span>¡Hola, {user.name || 'Explorador'}!</span>
          </div>
          
          <div className="progress-section">
            <div className="progress-stats">
              <span>{completedCount}/{programs.length} Desafíos</span>
              <Trophy className="trophy-icon" />
              <span>{user.progress.totalPoints} puntos</span>
            </div>
            <ProgressBar 
              progress={totalProgress} 
              height="8px"
              color="#4F46E5"
            />
          </div>
          
          <div className="nav-buttons">
            <button 
              className="nav-btn"
              onClick={() => navigate('/')}
              title="Inicio"
            >
              <Home size={20} />
            </button>
            <button 
              className="nav-btn"
              onClick={() => navigate('/perfil')}
              title="Mi Perfil"
            >
              <User size={20} />
            </button>
            <button 
              className="nav-btn"
              onClick={() => navigate('/guias')}
              title="Guías y Profesores"
            >
              <Users size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mapa Principal */}
      <motion.div 
        className="map-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="map-background">
          <svg viewBox="0 0 100 100" className="connection-lines">
            {/* Líneas conectoras entre programas */}
            <path
              d="M15,20 Q35,35 50,45"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2,2"
            />
            <path
              d="M75,15 Q60,30 50,45"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2,2"
            />
            <path
              d="M20,60 Q35,52 50,45"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2,2"
            />
          </svg>
        </div>

        {/* Nodos de programas */}
        {programs.map((program) => {
          const IconComponent = program.icon
          const isCompleted = challenges[program.id]?.completed
          const isHovered = hoveredProgram === program.id
          const isSelected = selectedProgram?.id === program.id
          const points = challenges[program.id]?.points || 0

          return (
            <motion.div
              key={program.id}
              className={`program-node ${isCompleted ? 'completed' : ''} ${isSelected ? 'selected' : ''}`}
              style={{
                left: `${program.position.x}%`,
                top: `${program.position.y}%`,
                '--program-color': program.color
              }}
              variants={programVariants}
              onClick={() => handleProgramClick(program)}
              onMouseEnter={() => setHoveredProgram(program.id)}
              onMouseLeave={() => setHoveredProgram(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="program-icon">
                <IconComponent size={32} />
                {isCompleted && (
                  <div className="completion-badge">
                    <Star size={16} />
                  </div>
                )}
              </div>
              
              <div className="program-label">
                <span className="program-name">{program.shortName}</span>
                {isCompleted && (
                  <span className="program-points">{points} pts</span>
                )}
              </div>

              {/* Tooltip con información */}
              {isHovered && (
                <motion.div
                  className="program-tooltip"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <h4>{program.name}</h4>
                  <p>{program.description}</p>
                  <div className="tooltip-footer">
                    <span className={`difficulty ${program.difficulty.toLowerCase()}`}>
                      {program.difficulty}
                    </span>
                    <span className="click-hint">Click para explorar</span>
                  </div>
                </motion.div>
              )}

              {/* Ondas de animación */}
              {!isCompleted && (
                <div className="pulse-animation">
                  <div className="pulse-ring"></div>
                  <div className="pulse-ring delay-1"></div>
                  <div className="pulse-ring delay-2"></div>
                </div>
              )}
            </motion.div>
          )
        })}

        {/* Panel de información del programa seleccionado */}
        {selectedProgram && (
          <motion.div 
            className="program-detail-panel"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
          >
            <div className="panel-header">
              <div className="panel-icon" style={{ backgroundColor: selectedProgram.color }}>
                <selectedProgram.icon size={24} />
              </div>
              <div className="panel-title">
                <h3>{selectedProgram.name}</h3>
                <p>{selectedProgram.shortName}</p>
              </div>
            </div>

            <div className="panel-content">
              <p className="program-description">{selectedProgram.description}</p>
              
              <div className="program-stats">
                <div className="stat-item">
                  <span className="stat-label">Dificultad:</span>
                  <span className={`stat-value difficulty ${selectedProgram.difficulty.toLowerCase()}`}>
                    {selectedProgram.difficulty}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Puntos máximos:</span>
                  <span className="stat-value">100 pts</span>
                </div>
                {challenges[selectedProgram.id]?.completed && (
                  <div className="stat-item">
                    <span className="stat-label">Tu puntuación:</span>
                    <span className="stat-value points">
                      {challenges[selectedProgram.id].points} pts
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="panel-actions">
              <button 
                className="start-challenge-btn"
                onClick={handleStartChallenge}
                style={{ backgroundColor: selectedProgram.color }}
              >
                {challenges[selectedProgram.id]?.completed ? 'Reintentar Desafío' : 'Comenzar Desafío'}
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setSelectedProgram(null)}
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Indicador de progreso total */}
      {completedCount === programs.length && (
        <motion.div 
          className="completion-celebration"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="celebration-content">
            <Trophy size={48} />
            <h2>¡Felicitaciones!</h2>
            <p>Has completado todos los desafíos de IA</p>
            <button 
              className="certificate-btn"
              onClick={() => navigate('/perfil')}
            >
              Ver Certificado
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdventureMap
