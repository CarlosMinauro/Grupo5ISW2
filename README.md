# CreditFLOW

## Descripción
Aplicación web desarrollada con React + TypeScript + Vite que proporciona una plataforma para la gestión de créditos.

## Tecnologías Utilizadas
- React 18
- TypeScript
- Vite
- ESLint
- Tailwind CSS

## Configuración del Proyecto

### Plugins Oficiales Disponibles
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) - Usa Babel para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) - Usa SWC para Fast Refresh

### Configuración de ESLint
Para desarrollo en producción, se recomienda actualizar la configuración para habilitar reglas de linting con tipos:

```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

### Configuración de React
```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Instalación y Desarrollo

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Iniciar servidor de desarrollo: `npm run dev`
4. Construir para producción: `npm run build`
