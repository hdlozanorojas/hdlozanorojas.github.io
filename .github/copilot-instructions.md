# Instrucciones para Copilot - Desafío IA: Tu Futuro en la U. Central

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexto del Proyecto

Este es un proyecto de página web interactiva para la Universidad Central que presenta un "mapa de aventura" donde los estudiantes pueden explorar 7 programas académicos a través de desafíos de IA.

## Estructura y Tecnologías

- **Framework**: React con Vite
- **Animaciones**: Framer Motion para transiciones y efectos
- **3D**: Three.js con React Three Fiber para simulaciones 3D
- **IA**: TensorFlow.js para modelos de Machine Learning
- **Gráficos**: Chart.js para visualización de datos
- **Routing**: React Router Dom
- **Iconos**: Lucide React

## Características Principales

1. **Mapa Interactivo**: Interfaz visual con íconos para 7 programas académicos
2. **Mini-juegos Educativos**: Cada programa tiene un desafío específico de IA
3. **Sistema de Gamificación**: Puntos, insignias y progreso visual
4. **Responsividad**: Compatible con desktop, tablet y móvil
5. **Accesibilidad**: Diseño inclusivo para diferentes capacidades

## Programas y Desafíos

1. **Ingeniería de Sistemas**: El Entrenador de Robots (ML clasificación)
2. **Ingeniería Ambiental**: El Guardián del Ecosistema IA (optimización)
3. **Ingeniería Industrial**: Optimizando la Fábrica del Futuro (logística)
4. **Ingeniería Electrónica**: El Circuit Maker Inteligente (simulación circuitos)
5. **Ingeniería Mecánica**: Robots en Acción (control robótico 3D)
6. **Biología**: El Bio-Detective de IA (clasificación biológica)
7. **Ciencias de Datos**: El Predictor Inteligente (análisis predictivo)

## Convenciones de Código

- Usar componentes funcionales con hooks
- Implementar TypeScript donde sea necesario
- Mantener componentes pequeños y reutilizables
- Usar CSS Modules o styled-components para estilos
- Implementar lazy loading para componentes pesados
- Seguir principios de accesibilidad (ARIA labels, semantic HTML)

## Estructura de Archivos

```
src/
├── components/
│   ├── common/         # Componentes reutilizables
│   ├── challenges/     # Mini-juegos por programa
│   ├── gamification/   # Sistema de puntos e insignias
│   └── ui/            # Componentes de interfaz
├── pages/             # Páginas principales
├── hooks/             # Custom hooks
├── utils/             # Utilidades y helpers
├── assets/            # Imágenes, videos, iconos
└── styles/            # Estilos globales
```

## Objetivos de Experiencia de Usuario

- Interfaz intuitiva para niños y adolescentes
- Carga rápida y fluidez en animaciones
- Feedback inmediato en interacciones
- Mensajes motivadores y celebraciones
- Navegación clara y accesible
