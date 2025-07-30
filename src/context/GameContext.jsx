import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Estados y acciones del juego
const initialState = {
  user: {
    name: '',
    progress: {
      completedChallenges: [],
      visitedPrograms: [], // Agregado para rastrear visitas
      totalPoints: 0,
      badges: [],
      currentLevel: 1
    }
  },
  challenges: {
    'sistemas': { id: 'sistemas', name: 'El Entrenador de Robots', completed: false, points: 0, maxPoints: 100 },
    'ambiental': { id: 'ambiental', name: 'El Guardián del Ecosistema IA', completed: false, points: 0, maxPoints: 100 },
    'industrial': { id: 'industrial', name: 'Optimizando la Fábrica del Futuro', completed: false, points: 0, maxPoints: 100 },
    'electronica': { id: 'electronica', name: 'El Circuit Maker Inteligente', completed: false, points: 0, maxPoints: 100 },
    'mecanica': { id: 'mecanica', name: 'Robots en Acción', completed: false, points: 0, maxPoints: 100 },
    'biologia': { id: 'biologia', name: 'El Bio-Detective de IA', completed: false, points: 0, maxPoints: 100 },
    'datos': { id: 'datos', name: 'El Predictor Inteligente', completed: false, points: 0, maxPoints: 100 }
  },
  badges: [
    { id: 'first-challenge', name: 'Primer Desafío', description: 'Completa tu primer desafío', icon: '🚀', unlocked: false },
    { id: 'ai-master', name: 'Maestro de IA', description: 'Completa todos los desafíos', icon: '🏆', unlocked: false },
    { id: 'explorer', name: 'Explorador', description: 'Visita todos los programas', icon: '🗺️', unlocked: false },
    { id: 'perfectionist', name: 'Perfeccionista', description: 'Obtén puntuación perfecta en un desafío', icon: '⭐', unlocked: false }
  ],
  currentChallenge: null,
  isLoading: false
}

// Reducer para manejar las acciones
function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_NAME':
      return {
        ...state,
        user: { ...state.user, name: action.payload }
      }
    
    case 'START_CHALLENGE':
      return {
        ...state,
        currentChallenge: action.payload
      }
    
    case 'VISIT_PROGRAM':
      const programId = action.payload
      const visitedPrograms = [...state.user.progress.visitedPrograms]
      
      // Agregar programa a visitados si no está ya
      if (!visitedPrograms.includes(programId)) {
        visitedPrograms.push(programId)
      }
      
      // Verificar si se visitaron todos los programas (7 programas)
      const allPrograms = ['sistemas', 'ambiental', 'industrial', 'electronica', 'mecanica', 'biologia', 'datos']
      const allVisited = allPrograms.every(program => visitedPrograms.includes(program))
      
      // Desbloquear badge de explorador si visitó todos
      const updatedBadgesForVisit = state.badges.map(badge => {
        if (badge.id === 'explorer' && allVisited) {
          return { ...badge, unlocked: true }
        }
        return badge
      })
      
      return {
        ...state,
        badges: updatedBadgesForVisit,
        user: {
          ...state.user,
          progress: {
            ...state.user.progress,
            visitedPrograms
          }
        }
      }
    
    case 'COMPLETE_CHALLENGE':
      const { challengeId, points } = action.payload
      console.log('🎯 COMPLETANDO DESAFÍO:', { challengeId, points })
      console.log('🔍 Estado actual challenges:', state.challenges)
      
      const updatedChallenges = {
        ...state.challenges,
        [challengeId]: {
          ...state.challenges[challengeId],
          completed: true,
          points: Math.max(state.challenges[challengeId].points, points)
        }
      }
      
      console.log('✨ Challenges actualizados:', updatedChallenges)
      
      const completedChallenges = [...state.user.progress.completedChallenges]
      if (!completedChallenges.includes(challengeId)) {
        completedChallenges.push(challengeId)
      }
      
      const totalPoints = Object.values(updatedChallenges).reduce((sum, challenge) => sum + challenge.points, 0)
      console.log('📊 Total points calculado:', totalPoints)
      
      // Verificar insignias
      const updatedBadges = state.badges.map(badge => {
        if (badge.id === 'first-challenge' && completedChallenges.length === 1) {
          return { ...badge, unlocked: true }
        }
        if (badge.id === 'ai-master' && completedChallenges.length === 7) {
          return { ...badge, unlocked: true }
        }
        if (badge.id === 'perfectionist' && points === 100) {
          return { ...badge, unlocked: true }
        }
        return badge
      })
      
      return {
        ...state,
        challenges: updatedChallenges,
        badges: updatedBadges,
        user: {
          ...state.user,
          progress: {
            ...state.user.progress,
            completedChallenges,
            totalPoints,
            currentLevel: Math.floor(totalPoints / 100) + 1
          }
        },
        currentChallenge: null
      }
    
    case 'UNLOCK_BADGE':
      const badgeIndex = state.badges.findIndex(badge => badge.id === action.payload)
      if (badgeIndex !== -1) {
        const updatedBadgesList = [...state.badges]
        updatedBadgesList[badgeIndex] = { ...updatedBadgesList[badgeIndex], unlocked: true }
        return {
          ...state,
          badges: updatedBadgesList
        }
      }
      return state
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'RESET_PROGRESS':
      return initialState
    
    default:
      return state
  }
}

// Contexto
const GameContext = createContext()

// Hook personalizado para usar el contexto
export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame debe usarse dentro de GameProvider')
  }
  return context
}

// Provider del contexto
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  
  // Cargar progreso del localStorage al iniciar
  useEffect(() => {
    const savedProgress = localStorage.getItem('desafio-ia-progress')
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        // Cargar datos guardados
        Object.keys(parsed.challenges || {}).forEach(challengeId => {
          if (parsed.challenges[challengeId].completed) {
            dispatch({
              type: 'COMPLETE_CHALLENGE',
              payload: {
                challengeId,
                points: parsed.challenges[challengeId].points
              }
            })
          }
        })
        if (parsed.user?.name) {
          dispatch({ type: 'SET_USER_NAME', payload: parsed.user.name })
        }
        // Cargar programas visitados
        if (parsed.user?.progress?.visitedPrograms) {
          parsed.user.progress.visitedPrograms.forEach(programId => {
            dispatch({ type: 'VISIT_PROGRAM', payload: programId })
          })
        }
      } catch (error) {
        console.error('Error cargando progreso:', error)
      }
    }
  }, [])
  
  // Guardar progreso en localStorage cuando cambie el estado
  useEffect(() => {
    console.log('💾 Guardando estado en localStorage:', state)
    localStorage.setItem('desafio-ia-progress', JSON.stringify(state))
  }, [state])
  
  const value = {
    ...state,
    dispatch,
    // Acciones útiles
    setUserName: (name) => dispatch({ type: 'SET_USER_NAME', payload: name }),
    startChallenge: (challengeId) => dispatch({ type: 'START_CHALLENGE', payload: challengeId }),
    visitProgram: (programId) => dispatch({ type: 'VISIT_PROGRAM', payload: programId }),
    completeChallenge: (challengeId, points) => dispatch({ 
      type: 'COMPLETE_CHALLENGE', 
      payload: { challengeId, points } 
    }),
    unlockBadge: (badgeId) => dispatch({ type: 'UNLOCK_BADGE', payload: badgeId }),
    setLoading: (isLoading) => dispatch({ type: 'SET_LOADING', payload: isLoading }),
    resetProgress: () => dispatch({ type: 'RESET_PROGRESS' })
  }
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
