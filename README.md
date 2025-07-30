# Desafío IA: Tu Futuro en la U. Central

Una página web interactiva que presenta un "mapa de aventura" donde los estudiantes pueden explorar 7 programas académicos de la Universidad Central a través de desafíos de Inteligencia Artificial.

## 🎯 Características

- **Mapa Interactivo**: Interfaz visual con íconos para 7 programas académicos
- **Mini-juegos Educativos**: Cada programa tiene un desafío específico de IA
- **Sistema de Gamificación**: Puntos, insignias y progreso visual
- **Responsividad**: Compatible con desktop, tablet y móvil
- **Accesibilidad**: Diseño inclusivo para diferentes capacidades

## 🚀 Programas y Desafíos

1. **Ingeniería de Sistemas**: El Entrenador de Robots (ML clasificación)
2. **Ingeniería Ambiental**: El Guardián del Ecosistema IA (optimización)
3. **Ingeniería Industrial**: Optimizando la Fábrica del Futuro (logística)
4. **Ingeniería Electrónica**: El Circuit Maker Inteligente (simulación circuitos)
5. **Ingeniería Mecánica**: Robots en Acción (control robótico 3D)
6. **Biología**: El Bio-Detective de IA (clasificación biológica)
7. **Ciencias de Datos**: El Predictor Inteligente (análisis predictivo)

## 🛠️ Tecnologías

- **Framework**: React con Vite
- **Animaciones**: Framer Motion
- **3D**: Three.js con React Three Fiber
- **IA**: TensorFlow.js
- **Gráficos**: Chart.js
- **Routing**: React Router Dom
- **Iconos**: Lucide React

## 📦 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/hdlozanorojas/hdlozanorojas.github.io.git

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🚀 Despliegue

Este proyecto está configurado para despliegue automático en GitHub Pages.

### Despliegue Manual
```bash
# Construir y desplegar manualmente
npm run deploy
```

### Despliegue Automático
El proyecto se despliega automáticamente en GitHub Pages cuando se hace push a la rama `main` mediante GitHub Actions.

## 📁 Estructura del Proyecto

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

## 🌐 URL de Acceso

La aplicación está desplegada en: [https://hdlozanorojas.github.io/](https://hdlozanorojas.github.io/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
