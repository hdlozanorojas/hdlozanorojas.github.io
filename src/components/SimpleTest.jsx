import React from 'react'

const SimpleTest = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1c3a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🚀 Test de Ruta /mapa</h1>
      <p>Si ves esto, las rutas están funcionando correctamente</p>
      <div style={{
        background: '#4F46E5',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        La ruta /mapa está respondiendo ✅
      </div>
    </div>
  )
}

export default SimpleTest
