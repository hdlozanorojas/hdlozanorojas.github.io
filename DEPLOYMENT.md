# 🚀 Guía de Despliegue en GitHub Pages

## ✅ Configuración Completada

### 1. **Configuración de Vite** (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // Ruta base para repositorio de usuario GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
})
```

### 2. **Scripts de Despliegue** (`package.json`)
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3. **Configuración del Router** (`src/App.jsx`)
- Agregado `basename="/"` al BrowserRouter (para repositorio de usuario)

### 4. **GitHub Actions** (`.github/workflows/deploy.yml`)
- Despliegue automático en cada push a `main`
- Build y deploy usando GitHub Pages Actions

### 5. **SPA Routing Support**
- `public/404.html` - Maneja rutas de Single Page App
- Script en `index.html` para redirecciones correctas

## 🎯 Pasos para Desplegar

### Opción A: Despliegue Automático (Recomendado)
1. **Hacer commit y push a GitHub:**
   ```bash
   git add .
   git commit -m "Configurar despliegue en GitHub Pages"
   git push origin main
   ```

2. **Configurar GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: **GitHub Actions**
   - Espera a que se complete el workflow

### Opción B: Despliegue Manual
```bash
# Instalar dependencias si no lo has hecho
npm install

# Construir y desplegar
npm run deploy
```

## 🌐 URLs de Acceso

- **Desarrollo**: `http://localhost:5173/`
- **Producción**: `https://hdlozanorojas.github.io/`

## 📋 Verificaciones Necesarias

### En GitHub Repository Settings:
1. **Pages Configuration:**
   - Source: GitHub Actions ✅
   - Branch: No especificar (se maneja por Actions) ✅

2. **Actions Permissions:**
   - Permitir GitHub Actions ✅
   - Permitir acciones de terceros ✅

### Verificar Deployment:
1. Ve a la pestaña **Actions** en tu repositorio
2. Verifica que el workflow "Deploy to GitHub Pages" se ejecute exitosamente
3. Una vez completado, la página estará disponible en la URL de producción

## 🔧 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Despliegue manual
npm run deploy

# Verificar errores
npm run lint
```

## 🆘 Solución de Problemas

### Si el sitio no carga:
1. Verifica que la configuración de Pages esté en "GitHub Actions"
2. Revisa que el workflow se haya ejecutado correctamente
3. Espera unos minutos después del deployment

### Si las rutas no funcionan:
1. Verifica que el `basename` en App.jsx sea correcto
2. Asegúrate de que los archivos 404.html y el script estén en su lugar

### Si hay errores de build:
1. Ejecuta `npm run build` localmente para identificar errores
2. Revisa la consola de GitHub Actions para más detalles

## 📝 Notas Importantes

- El despliegue automático se activa con cada push a `main`
- Los archivos se construyen en la carpeta `dist/`
- GitHub Pages puede tardar algunos minutos en actualizar
- Asegúrate de que todos los assets usen rutas relativas
