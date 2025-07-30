import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Play, ArrowRight, Sparkles } from 'lucide-react'
import { useGame } from '../context/GameContext'
import ParticlesBackground from '../components/ui/ParticlesBackground'
import './HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()
  const { setUserName } = useGame()
  const [showNameInput, setShowNameInput] = useState(false)
  const [name, setName] = useState('')
  const [videoPlaying, setVideoPlaying] = useState(false)

  const handleStartAdventure = () => {
    if (name.trim()) {
      setUserName(name.trim())
      navigate('/mapa')
    } else {
      setShowNameInput(true)
    }
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      setUserName(name.trim())
      navigate('/mapa')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="home-page">
      {/* Particles Background */}
      <ParticlesBackground density={100} color="#3B82F6" />
      
      {/* Video de fondo */}
      <div className="video-background">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="background-video"
        >
          <source src="/videos/ai-intro-animation.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Contenido principal */}
      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="university-logo" variants={itemVariants}>
          <img src="/images/ucentral-logo.png" alt="Universidad Central" />
        </motion.div>

        <motion.h1 className="hero-title" variants={itemVariants}>
          <span className="title-main">¡Desafío IA!</span>
          <span className="title-sub">Descubre tu Súper Poder en la U. Central</span>
        </motion.h1>

        <motion.p className="hero-description" variants={itemVariants}>
          La Inteligencia Artificial está en todas partes, ¡y es el futuro! 
          ¿Estás listo para explorar cómo la ingeniería y las ciencias la usan 
          para cambiar el mundo? Elige tu desafío y descubre tu pasión.
        </motion.p>

        {/* Video demo */}
        <motion.div className="demo-video-section" variants={itemVariants}>
          {!videoPlaying ? (
            <div className="video-placeholder" onClick={() => setVideoPlaying(true)}>
              <div className="play-button">
                <Play size={48} />
              </div>
              <div className="video-info">
                <h3>Video Introductorio</h3>
                <p>30 segundos de aventura te esperan</p>
              </div>
            </div>
          ) : (
            <video 
              controls 
              autoPlay 
              className="demo-video"
              onEnded={() => setVideoPlaying(false)}
            >
              <source src="/videos/desafio-ia-intro.mp4" type="video/mp4" />
            </video>
          )}
        </motion.div>

        {/* Formulario de nombre */}
        {showNameInput && (
          <motion.form 
            className="name-input-form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleNameSubmit}
          >
            <div className="input-group">
              <label htmlFor="userName">¿Cómo te llamas, explorador?</label>
              <input
                type="text"
                id="userName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre"
                autoFocus
                maxLength={20}
              />
            </div>
          </motion.form>
        )}

        {/* Botón principal */}
        <motion.button 
          className="cta-button"
          variants={itemVariants}
          onClick={handleStartAdventure}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="button-icon" />
          {showNameInput ? 'Comenzar Aventura' : '¡Comenzar la Aventura!'}
          <ArrowRight className="button-arrow" />
        </motion.button>

        {/* Estadísticas rápidas */}
        <motion.div className="quick-stats" variants={itemVariants}>
          <div className="stat-item">
            <div className="stat-number">7</div>
            <div className="stat-label">Programas</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">7</div>
            <div className="stat-label">Desafíos IA</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Posibilidades</div>
          </div>
        </motion.div>

        {/* Floating elements */}
        <div className="floating-elements">
          <motion.div 
            className="floating-ai-icon"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🤖
          </motion.div>
          <motion.div 
            className="floating-spark"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✨
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div className="home-footer" variants={itemVariants}>
        <p>Una experiencia interactiva de la Facultad de Ingeniería y Ciencias</p>
      </motion.div>
    </div>
  )
}

export default HomePage
