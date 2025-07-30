import React from 'react'
import './RippleButton.css'

const RippleButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  variant = 'primary',
  ...props 
}) => {
  const handleClick = (e) => {
    if (disabled) return

    // Create ripple effect
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    
    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `
    
    button.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)

    if (onClick) onClick(e)
  }

  return (
    <button
      className={`ripple-button ${variant} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default RippleButton
