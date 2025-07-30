import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import { 
  User, 
  Trophy, 
  Star, 
  Medal, 
  Download, 
  ArrowLeft,
  LogOut,
  AlertTriangle,
  Brain,
  Leaf,
  Factory,
  Zap,
  Cog,
  Microscope,
  BarChart3
} from 'lucide-react'
import { useGame } from '../context/GameContext'
import './ProfilePage.css'

// Componente ProgressBar simple inline
const ProgressBar = ({ progress, height = '12px', color = '#4F46E5' }) => (
  <div style={{
    width: '100%',
    height,
    backgroundColor: '#E5E7EB',
    borderRadius: '6px',
    overflow: 'hidden'
  }}>
    <div style={{
      width: `${Math.min(Math.max(progress, 0), 100)}%`,
      height: '100%',
      backgroundColor: color,
      borderRadius: '6px',
      transition: 'width 0.8s ease'
    }} />
  </div>
)

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, challenges, badges, visitProgram, resetProgress } = useGame()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const programIcons = {
    'sistemas': Brain,
    'ambiental': Leaf,
    'industrial': Factory,
    'electronica': Zap,
    'mecanica': Cog,
    'biologia': Microscope,
    'datos': BarChart3
  }

  const programNames = {
    'sistemas': 'Ingeniería de Sistemas',
    'ambiental': 'Ingeniería Ambiental',
    'industrial': 'Ingeniería Industrial',
    'electronica': 'Ingeniería Electrónica',
    'mecanica': 'Ingeniería Mecánica',
    'biologia': 'Biología',
    'datos': 'Ciencias de Datos'
  }

  const completedChallenges = Object.values(challenges).filter(c => c.completed)
  const totalChallenges = Object.keys(challenges).length
  const completionPercentage = (completedChallenges.length / totalChallenges) * 100
  const unlockedBadges = badges.filter(b => b.unlocked)

  // Efecto para marcar automáticamente programas como visitados si tienen desafíos completados
  useEffect(() => {
    const allPrograms = ['sistemas', 'ambiental', 'industrial', 'electronica', 'mecanica', 'biologia', 'datos']
    const currentVisited = user.progress.visitedPrograms || []
    
    // Marcar como visitados todos los programas que tienen desafíos completados
    Object.keys(challenges).forEach(challengeId => {
      if (challenges[challengeId].completed && !currentVisited.includes(challengeId)) {
        visitProgram(challengeId)
      }
    })
    
    // Si el usuario tiene al menos un desafío completado, probablemente ha visto el mapa
    // Marcar todos los programas como visitados para usuarios existentes
    if (completedChallenges.length > 0) {
      allPrograms.forEach(programId => {
        if (!currentVisited.includes(programId)) {
          visitProgram(programId)
        }
      })
    }
  }, [challenges, completedChallenges.length, user.progress.visitedPrograms, visitProgram])

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

  const downloadCertificate = () => {
    const pdf = new jsPDF('landscape', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Fondo con degradado (simulado con rectángulos)
    pdf.setFillColor(25, 35, 55) // Color azul oscuro de fondo
    pdf.rect(0, 0, pageWidth, pageHeight, 'F')
    
    // Bordes decorativos
    pdf.setFillColor(255, 215, 0) // Dorado
    pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, 'S')
    pdf.setLineWidth(2)
    pdf.setDrawColor(255, 215, 0)
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S')
    
    // Logo Universidad Central (simulado con texto)
    pdf.setFillColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(16)
    pdf.setTextColor(255, 255, 255)
    pdf.text('UNIVERSIDAD CENTRAL', 25, 30)
    pdf.setFontSize(12)
    pdf.text('BOGOTÁ - COLOMBIA', 25, 38)
    
    // Título principal
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(32)
    pdf.setTextColor(255, 215, 0) // Dorado
    const titleText = 'CERTIFICADO DE PARTICIPACIÓN'
    const titleWidth = pdf.getTextWidth(titleText)
    pdf.text(titleText, (pageWidth - titleWidth) / 2, 60)
    
    // Subtítulo
    pdf.setFontSize(18)
    pdf.setTextColor(255, 255, 255)
    const subtitleText = 'DESAFÍO IA: TU FUTURO EN LA U. CENTRAL'
    const subtitleWidth = pdf.getTextWidth(subtitleText)
    pdf.text(subtitleText, (pageWidth - subtitleWidth) / 2, 75)
    
    // Texto "Otorgado a"
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(14)
    const otorgadoText = 'Otorgado a:'
    const otorgadoWidth = pdf.getTextWidth(otorgadoText)
    pdf.text(otorgadoText, (pageWidth - otorgadoWidth) / 2, 95)
    
    // Nombre del participante
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(24)
    pdf.setTextColor(255, 215, 0) // Dorado
    const userName = user.name || 'EXPLORADOR DE IA'
    const nameWidth = pdf.getTextWidth(userName.toUpperCase())
    pdf.text(userName.toUpperCase(), (pageWidth - nameWidth) / 2, 110)
    
    // Línea decorativa bajo el nombre
    pdf.setLineWidth(1)
    pdf.setDrawColor(255, 215, 0)
    pdf.line((pageWidth - nameWidth) / 2, 115, (pageWidth + nameWidth) / 2, 115)
    
    // Texto descriptivo
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)
    pdf.setTextColor(255, 255, 255)
    
    const descripcion1 = 'Por haber participado exitosamente en el programa de exploración tecnológica'
    const desc1Width = pdf.getTextWidth(descripcion1)
    pdf.text(descripcion1, (pageWidth - desc1Width) / 2, 130)
    
    const descripcion2 = '"DESAFÍO IA: TU FUTURO EN LA U. CENTRAL"'
    const desc2Width = pdf.getTextWidth(descripcion2)
    pdf.text(descripcion2, (pageWidth - desc2Width) / 2, 140)
    
    const descripcion3 = `Completando ${completedChallenges.length} de ${totalChallenges} desafíos con una puntuación de ${user.progress.totalPoints} puntos`
    const desc3Width = pdf.getTextWidth(descripcion3)
    pdf.text(descripcion3, (pageWidth - desc3Width) / 2, 150)
    
    // Estadísticas de logros
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.setTextColor(255, 215, 0)
    
    const statsY = 165
    const statSpacing = 60
    const startX = 40
    
    // Desafíos completados
    pdf.text('DESAFÍOS COMPLETADOS', startX, statsY)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(255, 255, 255)
    pdf.text(`${completedChallenges.length}/${totalChallenges}`, startX, statsY + 8)
    
    // Puntos totales
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 215, 0)
    pdf.text('PUNTOS OBTENIDOS', startX + statSpacing, statsY)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(255, 255, 255)
    pdf.text(`${user.progress.totalPoints}`, startX + statSpacing, statsY + 8)
    
    // Insignias desbloqueadas
    const unlockedBadges = badges.filter(b => b.unlocked)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 215, 0)
    pdf.text('INSIGNIAS OBTENIDAS', startX + (statSpacing * 2), statsY)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(255, 255, 255)
    pdf.text(`${unlockedBadges.length}`, startX + (statSpacing * 2), statsY + 8)
    
    // Nivel alcanzado
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 215, 0)
    pdf.text('NIVEL ALCANZADO', startX + (statSpacing * 3), statsY)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(255, 255, 255)
    pdf.text(`Nivel ${user.progress.currentLevel}`, startX + (statSpacing * 3), statsY + 8)
    
    // Fecha
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(200, 200, 200)
    const fecha = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    const fechaText = `Bogotá, ${fecha}`
    pdf.text(fechaText, 25, pageHeight - 25)
    
    // Firmas (simuladas)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.setTextColor(255, 255, 255)
    
    // Firma izquierda
    pdf.line(40, pageHeight - 40, 100, pageHeight - 40)
    pdf.text('Director de Programa', 45, pageHeight - 35)
    pdf.text('Universidad Central', 45, pageHeight - 30)
    
    // Firma derecha
    pdf.line(pageWidth - 100, pageHeight - 40, pageWidth - 40, pageHeight - 40)
    pdf.text('Coordinador IA', pageWidth - 95, pageHeight - 35)
    pdf.text('Desafío Tecnológico', pageWidth - 95, pageHeight - 30)
    
    // Sello oficial (simulado)
    pdf.setFillColor(255, 215, 0)
    pdf.setTextColor(25, 35, 55)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.circle(pageWidth - 50, 40, 15, 'F')
    pdf.text('OFICIAL', pageWidth - 58, 38)
    pdf.text('UCENTRAL', pageWidth - 62, 43)
    
    // Código de verificación
    pdf.setTextColor(150, 150, 150)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    const codigoVerificacion = `Código: UC-IA-${Date.now().toString().slice(-6)}`
    pdf.text(codigoVerificacion, pageWidth - 80, pageHeight - 10)
    
    // Descargar el PDF
    const fileName = `certificado-ia-${(user.name || 'explorador').replace(/\s+/g, '-').toLowerCase()}.pdf`
    pdf.save(fileName)
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <motion.header 
        className="profile-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <button className="back-button" onClick={() => navigate('/mapa')}>
          <ArrowLeft size={20} />
          Volver al Mapa
        </button>
        <h1>Mi Perfil de Explorador</h1>
        <button 
          className="logout-button" 
          onClick={() => setShowLogoutModal(true)}
          title="Cerrar sesión y eliminar progreso"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </motion.header>

      <div className="profile-content">
        {/* User Info Card */}
        <motion.div 
          className="user-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="user-avatar">
            <User size={48} />
          </div>
          <div className="user-info">
            <h2>{user.name || 'Explorador de IA'}</h2>
            <p className="user-title">Nivel {user.progress.currentLevel} - Explorador</p>
            <div className="user-stats">
              <div className="stat">
                <Trophy className="stat-icon" />
                <span>{user.progress.totalPoints} puntos</span>
              </div>
              <div className="stat">
                <Medal className="stat-icon" />
                <span>{unlockedBadges.length} insignias</span>
              </div>
              <div className="stat">
                <Star className="stat-icon" />
                <span>{completedChallenges.length}/{totalChallenges} desafíos</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          className="progress-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3>Progreso General</h3>
          <div className="progress-overview">
            <div className="progress-circle">
              <svg viewBox="0 0 100 100" className="circle-progress">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke="#E5E7EB" 
                  strokeWidth="8" 
                  fill="none"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke="#4F46E5" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray={`${completionPercentage * 2.83} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text 
                  x="50" 
                  y="50" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="progress-text"
                >
                  {Math.round(completionPercentage)}%
                </text>
              </svg>
            </div>
            <div className="progress-details">
              <p>Has completado <strong>{completedChallenges.length}</strong> de <strong>{totalChallenges}</strong> desafíos</p>
              <ProgressBar 
                progress={completionPercentage} 
                height="12px"
                color="#4F46E5"
              />
            </div>
          </div>
        </motion.div>

        {/* Challenges Progress */}
        <motion.div 
          className="challenges-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>Desafíos Completados</h3>
          <div className="challenges-grid">
            {Object.entries(challenges).map(([id, challenge]) => {
              const IconComponent = programIcons[id]
              const isCompleted = challenge.completed
              
              return (
                <div 
                  key={id}
                  className={`challenge-item ${isCompleted ? 'completed' : 'pending'}`}
                >
                  <div className="challenge-icon">
                    <IconComponent size={24} />
                  </div>
                  <div className="challenge-info">
                    <h4>{programNames[id]}</h4>
                    <p>{challenge.name}</p>
                    {isCompleted ? (
                      <div className="challenge-score">
                        <Star size={16} />
                        <span>{challenge.points} puntos</span>
                      </div>
                    ) : (
                      <span className="challenge-pending">Pendiente</span>
                    )}
                  </div>
                  {isCompleted && (
                    <div className="completion-badge">
                      <Trophy size={20} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Badges Collection */}
        <motion.div 
          className="badges-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3>Colección de Insignias</h3>
          <div className="badges-grid">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}
                title={badge.description}
              >
                <div className="badge-icon">
                  <span className="badge-emoji">{badge.icon}</span>
                </div>
                <div className="badge-info">
                  <h4>{badge.name}</h4>
                  <p>{badge.description}</p>
                </div>
                {!badge.unlocked && (
                  <div className="badge-lock">🔒</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certificate Section */}
        {completedChallenges.length === totalChallenges && (
          <motion.div 
            className="certificate-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="certificate-content">
              <Trophy size={48} className="certificate-icon" />
              <h3>¡Felicitaciones!</h3>
              <p>Has completado todos los desafíos de IA. Descarga tu certificado oficial.</p>
              <button 
                className="download-certificate-btn"
                onClick={downloadCertificate}
              >
                <Download size={20} />
                Descargar Certificado
              </button>
            </div>
          </motion.div>
        )}

        {/* Achievement Stats */}
        <motion.div 
          className="stats-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3>Estadísticas de Logros</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{user.progress.totalPoints}</div>
              <div className="stat-label">Puntos Totales</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{user.progress.currentLevel}</div>
              <div className="stat-label">Nivel Actual</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{completedChallenges.length}</div>
              <div className="stat-label">Desafíos Completados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{unlockedBadges.length}</div>
              <div className="stat-label">Insignias Desbloqueadas</div>
            </div>
          </div>
        </motion.div>
      </div>

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
            className="logout-modal"
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
                <li>• Historial de visitas</li>
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

export default ProfilePage
