import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RefreshCw, CheckCircle, XCircle, Brain, Code, Terminal, Zap } from 'lucide-react'
import './SistemasChallenge.css'

const SistemasChallenge = ({ onComplete, onScoreChange }) => {
  const [currentPhase, setCurrentPhase] = useState('instructions') // instructions, easy, hard, results
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [currentExercise, setCurrentExercise] = useState('easy')
  const [exerciseCompleted, setExerciseCompleted] = useState({ easy: false, hard: false })
  const [testResults, setTestResults] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState('')

  // Referencias para sincronizar scroll
  const textareaRef = useRef(null)
  const highlightRef = useRef(null)

  // Función para sincronizar scroll
  const handleScroll = (e) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.target.scrollTop
      highlightRef.current.scrollLeft = e.target.scrollLeft
    }
  }

  // Función para resaltar sintaxis de Python
  const highlightPythonSyntax = (code) => {
    if (!code) return <div className="code-line"><span style={{ color: '#d4d4d4' }}>&nbsp;</span></div>
    
    // Palabras clave de Python
    const keywords = ['def', 'if', 'else', 'elif', 'for', 'while', 'in', 'return', 'pass', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'class', 'and', 'or', 'not', 'is', 'None', 'True', 'False', 'break', 'continue', 'lambda', 'yield']
    
    // Dividir el código en líneas
    const lines = code.split('\n')
    
    return (
      <div>
        {lines.map((line, lineIndex) => {
          if (!line.trim()) {
            return (
              <div key={lineIndex} className="code-line">
                <span style={{ color: '#d4d4d4' }}>&nbsp;</span>
              </div>
            )
          }
          
          // Tokenizar la línea
          const tokens = []
          let currentToken = ''
          let i = 0
          
          while (i < line.length) {
            const char = line[i]
            
            // Manejar comentarios
            if (char === '#') {
              if (currentToken) {
                tokens.push({ type: 'text', value: currentToken })
                currentToken = ''
              }
              const comment = line.slice(i)
              tokens.push({ type: 'comment', value: comment })
              break
            }
            
            // Manejar strings con comillas dobles
            else if (char === '"') {
              if (currentToken) {
                tokens.push({ type: 'text', value: currentToken })
                currentToken = ''
              }
              let stringValue = '"'
              i++
              while (i < line.length && line[i] !== '"') {
                if (line[i] === '\\' && i + 1 < line.length) {
                  stringValue += line[i] + line[i + 1]
                  i += 2
                } else {
                  stringValue += line[i]
                  i++
                }
              }
              if (i < line.length) stringValue += '"'
              tokens.push({ type: 'string', value: stringValue })
            }
            
            // Manejar strings con comillas simples
            else if (char === "'") {
              if (currentToken) {
                tokens.push({ type: 'text', value: currentToken })
                currentToken = ''
              }
              let stringValue = "'"
              i++
              while (i < line.length && line[i] !== "'") {
                if (line[i] === '\\' && i + 1 < line.length) {
                  stringValue += line[i] + line[i + 1]
                  i += 2
                } else {
                  stringValue += line[i]
                  i++
                }
              }
              if (i < line.length) stringValue += "'"
              tokens.push({ type: 'string', value: stringValue })
            }
            
            // Manejar operadores y símbolos
            else if (/[+\-*/%=<>!&|^~()[\]{}:,]/.test(char)) {
              if (currentToken) {
                tokens.push({ type: 'text', value: currentToken })
                currentToken = ''
              }
              tokens.push({ type: 'symbol', value: char })
            }
            
            // Manejar espacios
            else if (/\s/.test(char)) {
              if (currentToken) {
                tokens.push({ type: 'text', value: currentToken })
                currentToken = ''
              }
              tokens.push({ type: 'space', value: char })
            }
            
            // Acumular otros caracteres
            else {
              currentToken += char
            }
            
            i++
          }
          
          // Agregar el último token si existe
          if (currentToken) {
            tokens.push({ type: 'text', value: currentToken })
          }
          
          // Renderizar tokens
          return (
            <div key={lineIndex} className="code-line">
              {tokens.map((token, tokenIndex) => {
                if (token.type === 'comment') {
                  return (
                    <span key={tokenIndex} style={{ color: '#6a9955', fontStyle: 'italic' }}>
                      {token.value}
                    </span>
                  )
                }
                
                if (token.type === 'string') {
                  return (
                    <span key={tokenIndex} style={{ color: '#ce9178' }}>
                      {token.value}
                    </span>
                  )
                }
                
                if (token.type === 'symbol') {
                  if (/[()[\]{}]/.test(token.value)) {
                    return (
                      <span key={tokenIndex} style={{ color: '#ffd700', fontWeight: '600' }}>
                        {token.value}
                      </span>
                    )
                  }
                  if (token.value === ':') {
                    return (
                      <span key={tokenIndex} style={{ color: '#d4d4d4', fontWeight: '600' }}>
                        {token.value}
                      </span>
                    )
                  }
                  if (/[+\-*/%=<>!&|^~]/.test(token.value)) {
                    return (
                      <span key={tokenIndex} style={{ color: '#c586c0' }}>
                        {token.value}
                      </span>
                    )
                  }
                  return (
                    <span key={tokenIndex} style={{ color: '#d4d4d4' }}>
                      {token.value}
                    </span>
                  )
                }
                
                if (token.type === 'space') {
                  return <span key={tokenIndex}>{token.value}</span>
                }
                
                if (token.type === 'text') {
                  // Verificar si es una palabra clave
                  if (keywords.includes(token.value)) {
                    return (
                      <span key={tokenIndex} style={{ color: '#569cd6', fontWeight: '600' }}>
                        {token.value}
                      </span>
                    )
                  }
                  
                  // Verificar si es un número
                  if (/^\d+\.?\d*$/.test(token.value)) {
                    return (
                      <span key={tokenIndex} style={{ color: '#b5cea8', fontWeight: '400' }}>
                        {token.value}
                      </span>
                    )
                  }
                  
                  // Verificar si es una función (buscar paréntesis después)
                  const nextNonSpaceToken = tokens.slice(tokenIndex + 1).find(t => t.type !== 'space')
                  if (nextNonSpaceToken && nextNonSpaceToken.value === '(' && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token.value)) {
                    return (
                      <span key={tokenIndex} style={{ color: '#dcdcaa', fontWeight: '600' }}>
                        {token.value}
                      </span>
                    )
                  }
                  
                  // Texto normal
                  return (
                    <span key={tokenIndex} style={{ color: '#d4d4d4' }}>
                      {token.value}
                    </span>
                  )
                }
                
                return <span key={tokenIndex}>{token.value}</span>
              })}
            </div>
          )
        })}
      </div>
    )
  }

  // Función para colorear el output del terminal
  const colorizeTerminalOutput = (text) => {
    if (!text) return null
    
    const lines = text.split('\n')
    
    return (
      <div>
        {lines.map((line, lineIndex) => {
          if (!line.trim()) {
            return <div key={lineIndex}>&nbsp;</div>
          }
          
          // Analizar cada línea y aplicar colores
          let processedLine = line
          
          // Prompts de PowerShell
          if (line.includes('PS C:\\workspace>')) {
            const parts = line.split(/(PS C:\\workspace>)/)
            return (
              <div key={lineIndex}>
                {parts.map((part, partIndex) => {
                  if (part === 'PS C:\\workspace>') {
                    return (
                      <span key={partIndex} style={{ color: '#007acc', fontWeight: '500' }}>
                        {part}
                      </span>
                    )
                  }
                  return <span key={partIndex} style={{ color: '#d4d4d4' }}>{part}</span>
                })}
              </div>
            )
          }
          
          // Errores
          if (line.includes('❌')) {
            return (
              <div key={lineIndex} style={{ color: '#f48771' }}>
                {line}
              </div>
            )
          }
          
          // Éxitos
          if (line.includes('✅')) {
            return (
              <div key={lineIndex} style={{ color: '#4ec9b0' }}>
                {line}
              </div>
            )
          }
          
          // Comandos python
          if (line.includes('python main.py')) {
            const parts = line.split(/(python main\.py)/)
            return (
              <div key={lineIndex}>
                {parts.map((part, partIndex) => {
                  if (part === 'python main.py') {
                    return (
                      <span key={partIndex} style={{ color: '#dcdcaa' }}>
                        {part}
                      </span>
                    )
                  }
                  return <span key={partIndex} style={{ color: '#d4d4d4' }}>{part}</span>
                })}
              </div>
            )
          }
          
          // Resultados
          if (line.includes('Resultado') && line.includes(':')) {
            const parts = line.split(/(Resultado \d+:)/)
            return (
              <div key={lineIndex}>
                {parts.map((part, partIndex) => {
                  if (/Resultado \d+:/.test(part)) {
                    return (
                      <span key={partIndex} style={{ color: '#4ec9b0', fontWeight: '500' }}>
                        {part}
                      </span>
                    )
                  }
                  // Resaltar números en el resto
                  const numberParts = part.split(/(\b\d+\b)/)
                  return numberParts.map((numPart, numIndex) => {
                    if (/^\d+$/.test(numPart)) {
                      return (
                        <span key={`${partIndex}-${numIndex}`} style={{ color: '#b5cea8' }}>
                          {numPart}
                        </span>
                      )
                    }
                    return (
                      <span key={`${partIndex}-${numIndex}`} style={{ color: '#d4d4d4' }}>
                        {numPart}
                      </span>
                    )
                  })
                })}
              </div>
            )
          }
          
          // Fibonacci específico
          if (line.includes('Fibonacci de') && line.includes(':')) {
            const parts = line.split(/(Fibonacci de \d+:)/)
            return (
              <div key={lineIndex}>
                {parts.map((part, partIndex) => {
                  if (/Fibonacci de \d+:/.test(part)) {
                    return (
                      <span key={partIndex} style={{ color: '#dcdcaa', fontWeight: '500' }}>
                        {part}
                      </span>
                    )
                  }
                  // Resaltar números
                  const numberParts = part.split(/(\b\d+\b)/)
                  return numberParts.map((numPart, numIndex) => {
                    if (/^\d+$/.test(numPart)) {
                      return (
                        <span key={`${partIndex}-${numIndex}`} style={{ color: '#b5cea8' }}>
                          {numPart}
                        </span>
                      )
                    }
                    return (
                      <span key={`${partIndex}-${numIndex}`} style={{ color: '#d4d4d4' }}>
                        {numPart}
                      </span>
                    )
                  })
                })}
              </div>
            )
          }
          
          // Serie
          if (line.includes('Serie de') && line.includes('números:')) {
            const parts = line.split(/(Serie de \d+ números:)/)
            return (
              <div key={lineIndex}>
                {parts.map((part, partIndex) => {
                  if (/Serie de \d+ números:/.test(part)) {
                    return (
                      <span key={partIndex} style={{ color: '#dcdcaa', fontWeight: '500' }}>
                        {part}
                      </span>
                    )
                  }
                  // Procesar arrays [0, 1, 1, 2, 3, 5, 8]
                  if (part.includes('[') && part.includes(']')) {
                    const arrayParts = part.split(/(\[.*?\])/)
                    return arrayParts.map((arrayPart, arrayIndex) => {
                      if (arrayPart.includes('[') && arrayPart.includes(']')) {
                        // Colorear números dentro del array
                        const innerParts = arrayPart.split(/(\d+)/)
                        return innerParts.map((innerPart, innerIndex) => {
                          if (/^\d+$/.test(innerPart)) {
                            return (
                              <span key={`${partIndex}-${arrayIndex}-${innerIndex}`} style={{ color: '#b5cea8' }}>
                                {innerPart}
                              </span>
                            )
                          }
                          return (
                            <span key={`${partIndex}-${arrayIndex}-${innerIndex}`} style={{ color: '#ffd700' }}>
                              {innerPart}
                            </span>
                          )
                        })
                      }
                      return (
                        <span key={`${partIndex}-${arrayIndex}`} style={{ color: '#d4d4d4' }}>
                          {arrayPart}
                        </span>
                      )
                    })
                  }
                  return (
                    <span key={partIndex} style={{ color: '#d4d4d4' }}>
                      {part}
                    </span>
                  )
                })}
              </div>
            )
          }
          
          // Mensajes de Copilot
          if (line.includes('🤖 GitHub Copilot:')) {
            return (
              <div key={lineIndex} style={{ color: '#ff6b35', fontWeight: '500' }}>
                {line}
              </div>
            )
          }
          
          // Mensajes con estrella
          if (line.includes('✨')) {
            return (
              <div key={lineIndex} style={{ color: '#ffd700' }}>
                {line}
              </div>
            )
          }
          
          // Línea normal
          return (
            <div key={lineIndex} style={{ color: '#d4d4d4' }}>
              {line}
            </div>
          )
        })}
      </div>
    )
  }

  // Ejercicios de programación
  const exercises = {
    easy: {
      title: "Completar la Suma",
      description: "Completa la función para sumar dos números",
      baseCode: `# Función para sumar dos números
def suma(a, b):
    # TODO: Completa esta función
    pass

# Pruebas
print("Resultado 1:", suma(5, 3))
print("Resultado 2:", suma(10, 20))
print("Resultado 3:", suma(-5, 15))`,
      solution: `# Función para sumar dos números
def suma(a, b):
    return a + b

# Pruebas
print("Resultado 1:", suma(5, 3))
print("Resultado 2:", suma(10, 20))
print("Resultado 3:", suma(-5, 15))`,
      expectedOutput: ["Resultado 1: 8", "Resultado 2: 30", "Resultado 3: 10"],
      points: 40
    },
    hard: {
      title: "Serie de Fibonacci",
      description: "Implementa una función recursiva para generar la serie de Fibonacci",
      baseCode: `# Función recursiva para calcular Fibonacci
def fibonacci(n):
    # TODO: Implementa la función recursiva
    pass

# Función para generar la serie
def generar_serie(cantidad):
    # TODO: Genera una lista con los primeros 'cantidad' números
    pass

# Pruebas
print("Fibonacci de 5:", fibonacci(5))
print("Fibonacci de 8:", fibonacci(8))
print("Serie de 7 números:", generar_serie(7))`,
      solution: `# Función recursiva para calcular Fibonacci
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Función para generar la serie
def generar_serie(cantidad):
    return [fibonacci(i) for i in range(cantidad)]

# Pruebas
print("Fibonacci de 5:", fibonacci(5))
print("Fibonacci de 8:", fibonacci(8))
print("Serie de 7 números:", generar_serie(7))`,
      expectedOutput: ["Fibonacci de 5: 5", "Fibonacci de 8: 21", "Serie de 7 números: [0, 1, 1, 2, 3, 5, 8]"],
      points: 60
    }
  }

  useEffect(() => {
    // Inicializar con el ejercicio fácil
    setCode(exercises.easy.baseCode)
  }, [])

  useEffect(() => {
    onScoreChange(score)
  }, [score, onScoreChange])

  // Simulador de ejecución de Python
  const runPythonCode = async () => {
    setIsRunning(true)
    setOutput('PS C:\\workspace> python main.py\nEjecutando...\n')
    
    // Simular tiempo de ejecución
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      let result = 'PS C:\\workspace> python main.py\n'
      const exercise = exercises[currentExercise]
      
      // Verificar si el código contiene las funciones necesarias
      if (currentExercise === 'easy') {
        if (code.includes('return a + b') || code.includes('return (a + b)')) {
          result += exercise.expectedOutput.join('\n') + '\n\nPS C:\\workspace> '
          checkExerciseCompletion(result)
        } else if (code.includes('def suma(a, b):') && !code.includes('pass')) {
          result += '❌ Error: La función debe retornar la suma de a + b\n\nPS C:\\workspace> '
        } else {
          result += '❌ Error: Debes completar la función suma()\n\nPS C:\\workspace> '
        }
      } else if (currentExercise === 'hard') {
        const hasFibonacci = code.includes('return fibonacci(n - 1) + fibonacci(n - 2)') || 
                            code.includes('return fibonacci(n-1) + fibonacci(n-2)')
        const hasBaseCase = code.includes('if n <= 1:') && code.includes('return n')
        const hasSeries = code.includes('[fibonacci(i) for i in range(cantidad)]') ||
                         code.includes('for i in range(cantidad)')
        
        if (hasFibonacci && hasBaseCase && hasSeries) {
          result += exercise.expectedOutput.join('\n') + '\n\nPS C:\\workspace> '
          checkExerciseCompletion(result)
        } else if (!hasBaseCase) {
          result += '❌ Error: Falta el caso base (if n <= 1: return n)\n\nPS C:\\workspace> '
        } else if (!hasFibonacci) {
          result += '❌ Error: Falta la recursión fibonacci(n-1) + fibonacci(n-2)\n\nPS C:\\workspace> '
        } else if (!hasSeries) {
          result += '❌ Error: Debes generar la serie con una lista\n\nPS C:\\workspace> '
        } else {
          result += '❌ Error: Revisa tu implementación\n\nPS C:\\workspace> '
        }
      }
      
      setOutput(result)
    } catch (error) {
      setOutput(`PS C:\\workspace> python main.py\n❌ SyntaxError: ${error.message}\n\nPS C:\\workspace> `)
    }
    
    setIsRunning(false)
  }

  const checkExerciseCompletion = (output) => {
    const exercise = exercises[currentExercise]
    const isCorrect = exercise.expectedOutput.every(line => output.includes(line))
    
    if (isCorrect && !exerciseCompleted[currentExercise]) {
      setExerciseCompleted(prev => ({ ...prev, [currentExercise]: true }))
      setScore(prev => prev + exercise.points)
      setTestResults(prev => [...prev, { exercise: currentExercise, correct: true, points: exercise.points }])
    }
  }

  // Función de typewriter para simular escritura de IA
  const typewriterEffect = async (targetCode, startingCode) => {
    setIsTyping(true)
    
    // Mostrar mensaje inicial de Copilot
    setOutput('🤖 GitHub Copilot: Analizando tu código...\n✨ Detectando qué falta por implementar...\n\nPS C:\\workspace> ')
    
    // Esperar un momento antes de empezar a escribir
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setOutput('🤖 GitHub Copilot: ¡Escribiendo código!\n✨ Implementando solución automáticamente...\n\nPS C:\\workspace> ')
    
    const currentLines = startingCode.split('\n')
    const targetLines = targetCode.split('\n')
    
    // Encontrar líneas que necesitan ser reemplazadas o agregadas
    const linesToUpdate = []
    
    for (let i = 0; i < targetLines.length; i++) {
      const targetLine = targetLines[i]
      const currentLine = currentLines[i] || ''
      
      // Identificar líneas que necesitan ser escritas
      if (targetLine !== currentLine) {
        // Es una línea que reemplaza 'pass' o agrega código nuevo
        if (currentLine.trim() === 'pass' || 
            currentLine.trim() === '' || 
            targetLine.includes('return') || 
            targetLine.includes('if') ||
            targetLine.includes('for') ||
            targetLine.includes('[') ||
            (targetLine.trim() !== '' && !targetLine.trim().startsWith('#') && !targetLine.trim().startsWith('def') && !targetLine.trim().startsWith('print'))) {
          
          linesToUpdate.push({
            lineIndex: i,
            fromText: currentLine,
            toText: targetLine,
            isReplacement: currentLine.trim() === 'pass'
          })
        }
      }
    }
    
    // Escribir cada línea identificada
    let workingCode = startingCode
    
    for (const update of linesToUpdate) {
      const lines = workingCode.split('\n')
      
      // Si es un reemplazo de 'pass', primero borrar
      if (update.isReplacement) {
        lines[update.lineIndex] = update.fromText.replace('pass', '').replace(/\s+$/, '')
        setCode(lines.join('\n'))
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      // Escribir la nueva línea carácter por carácter
      const baseIndentation = update.toText.match(/^\s*/)[0] // Preservar indentación
      let currentContent = update.isReplacement ? baseIndentation : lines[update.lineIndex]
      
      for (let charIndex = currentContent.length; charIndex <= update.toText.length; charIndex++) {
        const partialText = update.toText.substring(0, charIndex)
        lines[update.lineIndex] = partialText
        
        setCode(lines.join('\n'))
        
        // Velocidad de escritura variable
        const char = update.toText[charIndex]
        let delay = 60
        
        if (!char) break
        
        // Pausas más largas en elementos importantes
        if (char === ' ' && update.toText.substring(charIndex + 1, charIndex + 7) === 'return') delay = 200
        if (char === ' ' && update.toText.substring(charIndex + 1, charIndex + 3) === 'if') delay = 200
        if (char === ' ' && update.toText.substring(charIndex + 1, charIndex + 4) === 'for') delay = 200
        if (char === '(' || char === '[' || char === ':') delay = 150
        if (char === ' ') delay = 80
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      workingCode = lines.join('\n')
      
      // Pausa al final de cada línea
      await new Promise(resolve => setTimeout(resolve, 400))
    }
    
    // Asegurar que el código final esté completo
    setCode(targetCode)
    
    // Mensaje final con efecto de escritura en el terminal
    const finalMessage = '🤖 GitHub Copilot: ¡Código completado exitosamente!\n✨ Solución implementada con las mejores prácticas.\n\n🚀 Presiona "Ejecutar" para probar tu código...\n\nPS C:\\workspace> '
    
    let terminalContent = ''
    for (let i = 0; i < finalMessage.length; i++) {
      terminalContent += finalMessage[i]
      setOutput(terminalContent)
      await new Promise(resolve => setTimeout(resolve, 30))
    }
    
    setIsTyping(false)
  }

  const optimizeWithAI = async () => {
    if (isTyping) return // Evitar múltiples ejecuciones
    
    const exercise = exercises[currentExercise]
    await typewriterEffect(exercise.solution, code)
  }

  const switchExercise = (exerciseType) => {
    setCurrentExercise(exerciseType)
    setCode(exercises[exerciseType].baseCode)
    setOutput('')
    if (exerciseType === 'easy') {
      setCurrentPhase('easy')
    } else {
      setCurrentPhase('hard')
    }
  }

  const startGame = () => {
    setCurrentPhase('easy')
    setCode(exercises.easy.baseCode)
    setOutput('')
  }

  const finishChallenge = () => {
    setCurrentPhase('results')
    onComplete(score)
  }

  return (
    <div className="sistemas-challenge">
      <AnimatePresence mode="wait">
        {currentPhase === 'instructions' && (
          <motion.div 
            key="instructions"
            className="instructions-phase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="instruction-card">
              <div className="card-header">
                <Code size={48} className="code-icon" />
                <h2>¡Conviértete en un Programador IA!</h2>
                <p>Aprende a programar con ayuda de inteligencia artificial</p>
              </div>

              <div className="instruction-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Ejercicio Fácil</h3>
                    <p>Completa una función de suma en Python</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Ejercicio Difícil</h3>
                    <p>Implementa la serie de Fibonacci con recursión</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>IA Assistant</h3>
                    <p>Usa la IA para optimizar tu código</p>
                  </div>
                </div>
              </div>

              <button 
                className="start-sistemas-btn"
                onClick={startGame}
              >
                <Code size={20} />
                Comenzar a Programar
              </button>
            </div>
          </motion.div>
        )}

        {(currentPhase === 'easy' || currentPhase === 'hard') && (
          <motion.div 
            key="coding"
            className="coding-phase"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="ide-container">
              <div className="ide-header">
                <div className="exercise-tabs">
                  <button 
                    className={`tab ${currentExercise === 'easy' ? 'active' : ''} ${exerciseCompleted.easy ? 'completed' : ''}`}
                    onClick={() => switchExercise('easy')}
                  >
                    {exerciseCompleted.easy && <CheckCircle size={16} />}
                    Ejercicio Fácil
                  </button>
                  <button 
                    className={`tab ${currentExercise === 'hard' ? 'active' : ''} ${exerciseCompleted.hard ? 'completed' : ''}`}
                    onClick={() => switchExercise('hard')}
                  >
                    {exerciseCompleted.hard && <CheckCircle size={16} />}
                    Ejercicio Difícil
                  </button>
                </div>
                <div className="score-display">
                  Puntos: {score}/100
                </div>
              </div>

              <div className="exercise-description">
                <h3>{exercises[currentExercise].title}</h3>
                <p>{exercises[currentExercise].description}</p>
              </div>

              <div className="ide-workspace">
                <div className="code-editor">
                  <div className="editor-header">
                    <div className="editor-title">
                      <Code size={16} />
                      main.py
                      <span className="file-indicator">●</span>
                    </div>
                    <div className="editor-actions">
                      <button 
                        className={`ai-optimize-btn ${isTyping ? 'typing' : ''}`}
                        onClick={optimizeWithAI}
                        disabled={isTyping || isRunning}
                        title={isTyping ? "Copilot escribiendo..." : "Optimizar con IA"}
                      >
                        <Brain size={14} />
                        {isTyping ? "Escribiendo..." : "Copilot"}
                      </button>
                      <button 
                        className="run-btn"
                        onClick={runPythonCode}
                        disabled={isRunning}
                        title={isRunning ? "Ejecutando..." : "Ejecutar código"}
                      >
                        {isRunning ? <RefreshCw size={14} className="spinning" /> : <Play size={14} />}
                        {isRunning ? "Ejecutando..." : "Ejecutar"}
                      </button>
                    </div>
                  </div>
                  <div className="editor-content">
                    <div className="line-numbers">
                      {code.split('\n').map((_, index) => (
                        <div key={index} className="line-number">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                    <div className="code-editor-wrapper">
                      <textarea
                        ref={textareaRef}
                        className="code-input"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onScroll={handleScroll}
                        placeholder="# Escribe tu código Python aquí..."
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                      />
                      <div ref={highlightRef} className="code-highlight" aria-hidden="true">
                        {highlightPythonSyntax(code)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="output-panel">
                  <div className="output-header">
                    <Terminal size={16} />
                    Terminal
                    <div className="output-actions">
                      <button 
                        className="clear-btn"
                        onClick={() => setOutput('')}
                        title="Limpiar terminal"
                      >
                        <XCircle size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="output-content">
                    <div className="terminal-prompt">
                      {output ? (
                        <div>{colorizeTerminalOutput(output)}</div>
                      ) : (
                        <div className="terminal-welcome">
                          <span className="prompt">PS C:\workspace&gt; </span>
                          <span className="cursor">│</span>
                          <div className="help-text">
                            Presiona "Ejecutar" para ver el resultado de tu código...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="challenge-progress">
                <div className="progress-item">
                  <span>Ejercicio Fácil:</span>
                  {exerciseCompleted.easy ? (
                    <span className="completed">✅ Completado (+40 pts)</span>
                  ) : (
                    <span className="pending">⏳ Pendiente</span>
                  )}
                </div>
                <div className="progress-item">
                  <span>Ejercicio Difícil:</span>
                  {exerciseCompleted.hard ? (
                    <span className="completed">✅ Completado (+60 pts)</span>
                  ) : (
                    <span className="pending">⏳ Pendiente</span>
                  )}
                </div>
              </div>

              {Object.values(exerciseCompleted).every(Boolean) && (
                <button 
                  className="finish-btn"
                  onClick={finishChallenge}
                >
                  <Zap size={20} />
                  Finalizar Desafío
                </button>
              )}
            </div>
          </motion.div>
        )}

        {currentPhase === 'results' && (
          <motion.div 
            key="results"
            className="results-phase"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="results-card">
              <h2>¡Desafío de Programación Completado!</h2>
              
              <div className="final-score">
                <div className="score-circle">
                  <span className="score-value">{score}</span>
                  <span className="score-label">/ 100 puntos</span>
                </div>
              </div>

              <div className="results-summary">
                <h3>Resumen de Ejercicios</h3>
                <div className="exercise-results">
                  <div className={`result-item ${exerciseCompleted.easy ? 'completed' : 'incomplete'}`}>
                    {exerciseCompleted.easy ? <CheckCircle className="success" /> : <XCircle className="error" />}
                    <div className="result-info">
                      <h4>Ejercicio Fácil - Suma</h4>
                      <p>{exerciseCompleted.easy ? 'Completado correctamente' : 'No completado'}</p>
                    </div>
                    <span className="points">{exerciseCompleted.easy ? '+40' : '0'} pts</span>
                  </div>

                  <div className={`result-item ${exerciseCompleted.hard ? 'completed' : 'incomplete'}`}>
                    {exerciseCompleted.hard ? <CheckCircle className="success" /> : <XCircle className="error" />}
                    <div className="result-info">
                      <h4>Ejercicio Difícil - Fibonacci</h4>
                      <p>{exerciseCompleted.hard ? 'Implementación recursiva correcta' : 'No completado'}</p>
                    </div>
                    <span className="points">{exerciseCompleted.hard ? '+60' : '0'} pts</span>
                  </div>
                </div>
              </div>

              <div className="learning-summary">
                <h3>Lo que Aprendiste</h3>
                <ul>
                  <li>✅ Sintaxis básica de Python</li>
                  <li>✅ Funciones y parámetros</li>
                  <li>✅ Programación recursiva</li>
                  <li>✅ Uso de IA para optimización de código</li>
                  <li>✅ Debugging y resolución de problemas</li>
                </ul>
              </div>

              <button 
                className="retry-button"
                onClick={() => {
                  setCurrentPhase('instructions')
                  setScore(0)
                  setExerciseCompleted({ easy: false, hard: false })
                  setTestResults([])
                  setCode(exercises.easy.baseCode)
                  setOutput('')
                }}
              >
                <RefreshCw size={20} />
                Nuevo Desafío
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SistemasChallenge
