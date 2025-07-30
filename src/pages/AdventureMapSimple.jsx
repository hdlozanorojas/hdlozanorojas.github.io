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
  Star,
  LogOut,
  AlertTriangle
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

const AdventureMapSimple = () => {
  const navigate = useNavigate()
  const { user, challenges, resetProgress } = useGame()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  const handleLogout = () => {
    // Resetear todo el progreso
    resetProgress()
    // Limpiar localStorage adicional si es necesario
    localStorage.removeItem('desafio-ia-progress')
    // Cerrar modal
    setShowLogoutModal(false)
    // Redirigir al inicio
    navigate('/')
  }

  // Verificar si hay progreso para mostrar el botón de logout
  const hasProgress = user.name || 
                     user.progress.totalPoints > 0 || 
                     user.progress.completedChallenges.length > 0 ||
                     user.progress.visitedPrograms.length > 0 ||
                     Object.values(challenges).some(challenge => challenge.completed)

  // Calcular estadísticas reales
  const completedChallenges = Object.values(challenges).filter(challenge => challenge.completed)
  const totalChallenges = Object.keys(challenges).length
  const totalPoints = user.progress.totalPoints
  const progressPercentage = (completedChallenges.length / totalChallenges) * 100

  const programs = [
    {
      id: 'sistemas',
      name: 'Ingeniería de Sistemas',
      shortName: 'El Entrenador de Robots',
      icon: Brain,
      description: 'Entrena modelos de IA para reconocimiento de patrones',
      color: '#4F46E5',
      position: { x: 20, y: 25 },
      difficulty: 'Fácil'
    },
    {
      id: 'ambiental',
      name: 'Ingeniería Ambiental',
      shortName: 'El Guardián del Ecosistema',
      icon: Leaf,
      description: 'Optimiza la recolección de residuos con IA',
      color: '#059669',
      position: { x: 70, y: 20 },
      difficulty: 'Medio'
    },
    {
      id: 'industrial',
      name: 'Ingeniería Industrial',
      shortName: 'Optimizando la Fábrica del Futuro',
      icon: Factory,
      description: 'Optimiza procesos de manufactura con IA',
      color: '#DC2626',
      position: { x: 15, y: 55 },
      difficulty: 'Medio'
    },
    {
      id: 'electronica',
      name: 'Ingeniería Electrónica',
      shortName: 'El Circuit Maker Inteligente',
      icon: Zap,
      description: 'Diseña circuitos inteligentes con IA',
      color: '#F59E0B',
      position: { x: 50, y: 35 },
      difficulty: 'Difícil'
    },
    {
      id: 'mecanica',
      name: 'Ingeniería Mecánica',
      shortName: 'Robots en Acción',
      icon: Cog,
      description: 'Controla robots autónomos con IA',
      color: '#7C2D12',
      position: { x: 75, y: 50 },
      difficulty: 'Difícil'
    },
    {
      id: 'biologia',
      name: 'Biología',
      shortName: 'El Bio-Detective de IA',
      icon: Microscope,
      description: 'Clasifica especies biológicas con IA',
      color: '#16A34A',
      position: { x: 25, y: 80 },
      difficulty: 'Medio'
    },
    {
      id: 'datos',
      name: 'Ciencias de Datos',
      shortName: 'El Predictor Inteligente',
      icon: BarChart3,
      description: 'Analiza datos y predice tendencias',
      color: '#9333EA',
      position: { x: 65, y: 75 },
      difficulty: 'Difícil'
    }
  ]

  return (
    <div className="adventure-map">
      {/* Header simplificado */}
      <motion.header 
        className="map-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="user-info">
            <User className="user-icon" />
            <span>¡Hola, {user.name}!</span>
          </div>
          
          <div className="progress-section">
            <div className="progress-stats">
              <span>{completedChallenges.length}/{totalChallenges} Desafíos</span>
              <Trophy className="trophy-icon" />
              <span>{totalPoints} puntos</span>
            </div>
            <ProgressBar 
              progress={progressPercentage} 
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
            {hasProgress && (
              <button 
                className="nav-btn logout-btn"
                onClick={() => setShowLogoutModal(true)}
                title="Cerrar sesión y eliminar progreso"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mapa Principal simplificado */}
      <motion.div 
        className="map-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="adventure-title">
          <h1>Mapa de Aventura IA</h1>
          <p>Explora los programas académicos y completa los desafíos</p>
        </div>

        {/* Programas - Layout adaptativo */}
        <div className="programs-container">
          {/* Layout de escritorio - Grid organizado */}
          <div className="desktop-programs-grid">
            {programs.map((program, index) => {
              const IconComponent = program.icon
              const challenge = challenges[program.id]
              const isCompleted = challenge?.completed || false
              const currentPoints = challenge?.points || 0
              const maxPoints = challenge?.maxPoints || 100
              
              return (
                <motion.div
                  key={program.id}
                  className={`program-card desktop ${isCompleted ? 'completed' : ''}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                  }}
                  onClick={() => navigate(`/desafio/${program.id}`)}
                >
                  <div className="card-header" style={{ backgroundColor: program.color }}>
                    <IconComponent size={48} color="white" />
                    {isCompleted && (
                      <div className="completion-badge">
                        <Star size={20} color="#FFD700" />
                      </div>
                    )}
                  </div>
                  <div className="card-content">
                    <h3>{program.name}</h3>
                    <h4>{program.shortName}</h4>
                    <p>{program.description}</p>
                    <div className="card-footer">
                      <span className={`difficulty ${program.difficulty.toLowerCase()}`}>
                        {program.difficulty}
                      </span>
                      <span className={`points ${isCompleted ? 'completed' : ''}`}>
                        {currentPoints}/{maxPoints} pts
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Layout móvil - Posición absoluta como mapa */}
          <div className="mobile-programs-map">
            {programs.map((program, index) => {
              const IconComponent = program.icon
              const challenge = challenges[program.id]
              const isCompleted = challenge?.completed || false
              const currentPoints = challenge?.points || 0
              const maxPoints = challenge?.maxPoints || 100
              
              return (
                <motion.div
                  key={program.id}
                  className={`program-node mobile ${isCompleted ? 'completed' : ''}`}
                  style={{
                    left: `${program.position.x}%`,
                    top: `${program.position.y}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.6,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => navigate(`/desafio/${program.id}`)}
                >
                  <div className="node-icon" style={{ backgroundColor: program.color }}>
                    <IconComponent size={32} />
                    {isCompleted && (
                      <div className="completion-badge-mobile">
                        <Star size={16} color="#FFD700" />
                      </div>
                    )}
                  </div>
                  <div className="node-content">
                    <h3>{program.name}</h3>
                    <p>{program.shortName}</p>
                    <div className="node-footer">
                      <span className="difficulty">{program.difficulty}</span>
                      <span className={`points ${isCompleted ? 'completed' : ''}`}>
                        {currentPoints}/{maxPoints}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Modal de confirmación de logout */}
      {showLogoutModal && (
        <motion.div 
          className="logout-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLogoutModal(false)}
        >
          <motion.div 
            className="logout-modal-map"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="logout-modal-header">
              <AlertTriangle size={48} className="warning-icon" />
              <h3>¿Cerrar Sesión?</h3>
            </div>
            <div className="logout-modal-content">
              <p>
                Al cerrar sesión se eliminará todo tu progreso, incluyendo:
              </p>
              <ul>
                <li>• Todos los desafíos completados</li>
                <li>• Puntos y nivel alcanzado</li>
                <li>• Insignias desbloqueadas</li>
                <li>• Historial de visitas a programas</li>
              </ul>
              <p className="warning-text">
                <strong>Esta acción no se puede deshacer.</strong>
              </p>
            </div>
            <div className="logout-modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="confirm-logout-button"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Confirmar Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AdventureMapSimple
