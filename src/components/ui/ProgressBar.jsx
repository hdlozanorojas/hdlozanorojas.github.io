import React from 'react'
import { motion } from 'framer-motion'
import './ProgressBar.css'

const ProgressBar = ({ 
  progress, 
  height = '12px', 
  color = '#4F46E5', 
  backgroundColor = 'rgba(255, 255, 255, 0.2)',
  animated = true,
  showPercentage = false,
  label = ''
}) => {
  return (
    <div className="progress-bar-container">
      {label && <label className="progress-label">{label}</label>}
      <div 
        className="progress-bar-track"
        style={{ 
          height,
          backgroundColor
        }}
      >
        <motion.div
          className="progress-bar-fill"
          style={{ 
            backgroundColor: color
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ 
            duration: animated ? 1 : 0,
            ease: "easeOut"
          }}
        />
        
        {/* Efectos de brillo */}
        {animated && progress > 0 && (
          <motion.div
            className="progress-shine"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      
      {showPercentage && (
        <span className="progress-percentage">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}

export default ProgressBar
