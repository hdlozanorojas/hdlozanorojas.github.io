import React from 'react'
import './ShimmerCard.css'

const ShimmerCard = ({ children, className = '', isActive = false, ...props }) => {
  return (
    <div 
      className={`shimmer-card ${isActive ? 'active' : ''} ${className}`}
      {...props}
    >
      <div className="shimmer-overlay"></div>
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}

export default ShimmerCard
