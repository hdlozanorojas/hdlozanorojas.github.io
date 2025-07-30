import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, Zap, Cpu, Brain, Rocket, Stars, ChevronDown } from 'lucide-react'
import { useGame } from '../context/GameContext'
import ParticlesBackground from '../components/ui/ParticlesBackground'
import logo33 from '../assets/logo33.png'
import './HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()
  const { setUserName } = useGame()
  const [showNameInput, setShowNameInput] = useState(false)
  const [name, setName] = useState('')
  const [currentGlow, setCurrentGlow] = useState(0)
  const controls = useAnimation()

  // Array de colores para el efecto glow dinámico
  const glowColors = ['#3B82F6', '#8B5CF6', '#06D6A0', '#F59E0B', '#EF4444']

  // Efecto de cambio de color del glow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGlow((prev) => (prev + 1) % glowColors.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Animación de entrada escalonada
  useEffect(() => {
    controls.start("visible")
  }, [controls])

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
        duration: 1.2,
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 80, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="home-page" style={{ '--current-glow': glowColors[currentGlow] }}>
      {/* Particles Background with enhanced effects */}
      <ParticlesBackground density={150} color={glowColors[currentGlow]} />
      
      {/* Animated Gradient Background */}
      <div className="gradient-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
      </div>

      {/* Tech Grid Background */}
      <div className="tech-grid">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="grid-dot"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Video de fondo mejorado */}
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
        <div className="holographic-overlay"></div>
      </div>

      {/* Contenido principal */}
      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Sección Superior: Logo y Título */}
        <div className="hero-top-section">
          {/* Logo con efecto holográfico */}
          <motion.div className="university-logo" variants={itemVariants}>
            <div className="logo-container">
              <img src={logo33} alt="Universidad Central" />
              <div className="logo-glow"></div>
              <div className="logo-scan-line"></div>
            </div>
          </motion.div>

          {/* Título con efectos avanzados */}
          <motion.div className="hero-title-container" variants={itemVariants}>
            <h1 className="hero-title">
              <motion.span 
                className="title-main"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="title-word">¡Desafío</span>
                <span className="title-word glow-text">IA!</span>
              </motion.span>
              <motion.span 
                className="title-sub"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Descubre tu <span className="highlight-text">Súper Poder</span> en la U. Central
              </motion.span>
            </h1>
          </motion.div>
        </div>

        {/* Sección Central: Descripción y Estadísticas en línea */}
        <div className="hero-middle-section">
          {/* Descripción compacta */}
          <motion.div className="hero-description-container" variants={itemVariants}>
            <p className="hero-description">
              La <span className="tech-highlight">Inteligencia Artificial</span> está transformando el mundo. 
              ¿Estás listo para ser parte de esta <span className="tech-highlight">revolución tecnológica</span>?
            </p>
          </motion.div>

          {/* Estadísticas compactas en línea */}
          <motion.div className="quick-stats-inline" variants={itemVariants}>
            <div className="stats-container-inline">
              <motion.div 
                className="stat-item-compact"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Brain size={20} />
                <span className="stat-number">7</span>
                <span className="stat-label">Programas</span>
              </motion.div>
              
              <motion.div 
                className="stat-item-compact"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Cpu size={20} />
                <span className="stat-number">7</span>
                <span className="stat-label">Desafíos</span>
              </motion.div>
              
              <motion.div 
                className="stat-item-compact"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Rocket size={20} />
                <span className="stat-number">∞</span>
                <span className="stat-label">Posibilidades</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Sección Inferior: Botón y Video en línea */}
        <div className="hero-bottom-section">
          {/* Formulario de nombre mejorado */}
          {showNameInput && (
            <motion.div
              className="name-input-container-compact"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <form className="name-input-form-compact" onSubmit={handleNameSubmit}>
                <div className="input-group-compact">
                  <input
                    type="text"
                    id="userName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="¿Cómo te llamas, explorador del futuro?"
                    autoFocus
                    maxLength={20}
                    className="futuristic-input-compact"
                  />
                </div>
              </form>
            </motion.div>
          )}

          <div className="action-section">
            {/* Botón principal compacto */}
            <motion.button 
              className="cta-button-compact"
              onClick={handleStartAdventure}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 10px 30px ${glowColors[currentGlow]}40`
              }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  `0 0 15px ${glowColors[currentGlow]}30`,
                  `0 0 25px ${glowColors[currentGlow]}60`,
                  `0 0 15px ${glowColors[currentGlow]}30`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              variants={itemVariants}
            >
              <div className="button-content-compact">
                <Sparkles className="button-icon" size={20} />
                <span className="button-text">
                  {showNameInput ? 'Iniciar Misión' : '¡Comenzar la Aventura!'}
                </span>
                <ArrowRight className="button-arrow" size={20} />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Iconos tecnológicos flotantes compactos */}
        <div className="tech-icons-compact">
          <motion.div className="tech-icon-small" variants={floatingVariants} animate="animate">
            <Brain size={16} />
          </motion.div>
          <motion.div className="tech-icon-small" variants={floatingVariants} animate="animate" style={{ animationDelay: '1s' }}>
            <Cpu size={16} />
          </motion.div>
          <motion.div className="tech-icon-small" variants={floatingVariants} animate="animate" style={{ animationDelay: '2s' }}>
            <Zap size={16} />
          </motion.div>
          <motion.div className="tech-icon-small" variants={floatingVariants} animate="animate" style={{ animationDelay: '3s' }}>
            <Rocket size={16} />
          </motion.div>
        </div>

        {/* Elementos flotantes mejorados - más pequeños */}
        <div className="floating-elements">
          <motion.div 
            className="floating-ai-icon floating-element-1"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🤖
          </motion.div>
          
          <motion.div 
            className="floating-spark floating-element-2"
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0],
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            ✨
          </motion.div>
          
          <motion.div 
            className="floating-circuit floating-element-3"
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            ⚡
          </motion.div>
          
          <motion.div 
            className="floating-data floating-element-4"
            animate={{
              y: [0, -12, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            💎
          </motion.div>
        </div>
      </motion.div>

      {/* Footer compacto */}
      <motion.div className="home-footer-compact" variants={itemVariants}>
        <p>Una experiencia de la <span className="highlight">Facultad de Ingeniería y Ciencias Básicas</span></p>
      </motion.div>
    </div>
  )
}

export default HomePage
