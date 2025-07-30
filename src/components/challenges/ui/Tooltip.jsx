import React, { useState } from 'react'
import './Tooltip.css'

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showTimeout, setShowTimeout] = useState(null)

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setShowTimeout(timeout)
  }

  const handleMouseLeave = () => {
    if (showTimeout) {
      clearTimeout(showTimeout)
    }
    setIsVisible(false)
  }

  return (
    <div 
      className={`tooltip-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={`tooltip-content ${position}`}>
          {content}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  )
}

export default Tooltip
