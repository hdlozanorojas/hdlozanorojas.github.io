import React, { useEffect, useRef } from 'react'
import './ParticlesBackground.css'

const ParticlesBackground = ({ density = 80, color = '#3B82F6' }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()

    const connectionDistance = 150
    const mouseRadius = 200

    class Particle {
      constructor() {
        this.reset()
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.6 + 0.4
        this.baseOpacity = this.opacity
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
      }

      update() {
        // Mouse interaction
        const dx = mouseRef.current.x - this.x
        const dy = mouseRef.current.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius
          const angle = Math.atan2(dy, dx)
          this.vx += Math.cos(angle) * force * 0.02
          this.vy += Math.sin(angle) * force * 0.02
        }

        // Update position
        this.x += this.vx
        this.y += this.vy

        // Boundary collision with damping
        if (this.x <= 0 || this.x >= canvas.width) {
          this.vx *= -0.9
          this.x = Math.max(0, Math.min(canvas.width, this.x))
        }
        if (this.y <= 0 || this.y >= canvas.height) {
          this.vy *= -0.9
          this.y = Math.max(0, Math.min(canvas.height, this.y))
        }

        // Add slight random movement
        this.vx += (Math.random() - 0.5) * 0.02
        this.vy += (Math.random() - 0.5) * 0.02

        // Velocity damping
        this.vx *= 0.995
        this.vy *= 0.995

        // Limit velocity
        const maxVel = 1
        this.vx = Math.max(-maxVel, Math.min(maxVel, this.vx))
        this.vy = Math.max(-maxVel, Math.min(maxVel, this.vy))
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity

        // Particle with glow effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 4
        )
        gradient.addColorStop(0, color + 'CC')
        gradient.addColorStop(0.4, color + '66')
        gradient.addColorStop(1, color + '00')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2)
        ctx.fill()

        // Inner bright particle
        ctx.fillStyle = color + 'FF'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      drawConnections(particles) {
        particles.forEach(particle => {
          if (particle === this) return

          const dx = this.x - particle.x
          const dy = this.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = 1 - (distance / connectionDistance)
            
            ctx.save()
            ctx.globalAlpha = opacity * 0.4
            ctx.strokeStyle = color + '99'
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(particle.x, particle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      }
    }

    // Initialize particles
    particlesRef.current = []
    for (let i = 0; i < density; i++) {
      particlesRef.current.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update particles
      particlesRef.current.forEach(particle => {
        particle.update()
      })

      // Draw connections first
      particlesRef.current.forEach(particle => {
        particle.drawConnections(particlesRef.current)
      })

      // Draw particles
      particlesRef.current.forEach(particle => {
        particle.draw()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
    }

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [density, color])

  return (
    <canvas 
      ref={canvasRef} 
      className="particles-background"
    />
  )
}

export default ParticlesBackground
