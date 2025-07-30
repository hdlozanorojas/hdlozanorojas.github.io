import React from 'react'
import './ProgressBar.css'

const ProgressBar = ({ 
  progress = 0, 
  max = 100, 
  showPercentage = true,
  animated = true,
  className = '',
  color = 'primary'
}) => {
  const percentage = Math.min(100, Math.max(0, (progress / max) * 100))

  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-track">
        <div 
          className={`progress-fill ${color} ${animated ? 'animated' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          <div className="progress-shine"></div>
        </div>
      </div>
      {showPercentage && (
        <span className="progress-text">{Math.round(percentage)}%</span>
      )}
    </div>
  )
}

export default ProgressBar
