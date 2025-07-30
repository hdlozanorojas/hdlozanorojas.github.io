import React, { useEffect, useState } from 'react'
import './ConfettiAnimation.css'

const ConfettiAnimation = ({ trigger = false, duration = 3000 }) => {
  const [particles, setParticles] = useState([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsActive(true)
      
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 200,
        velocityY: Math.random() * -500 - 200,
        gravity: Math.random() * 300 + 200,
        delay: Math.random() * 500
      }))
      
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setIsActive(false)
        setParticles([])
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [trigger, duration])

  if (!isActive) return null

  return (
    <div className="confetti-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.delay}ms`,
            '--velocity-x': `${particle.velocityX}px`,
            '--velocity-y': `${particle.velocityY}px`,
            '--gravity': `${particle.gravity}px`
          }}
        />
      ))}
    </div>
  )
}

export default ConfettiAnimation
