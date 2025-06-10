# Sistema de Gestión de Presupuestos y Gastos

Este proyecto es un sistema completo de gestión de presupuestos y gastos, desarrollado con React + TypeScript en el frontend y Node.js + Express + TypeScript en el backend.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- PostgreSQL (versión 14 o superior)
- Git

## Estructura del Proyecto

El proyecto está dividido en dos carpetas principales:
- `/new-front`: Frontend en React + TypeScript
- `/new-back`: Backend en Node.js + Express + TypeScript

## Pasos de Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/CarlosMinauro/Grupo5ISW2.git
cd Grupo5ISW2
```

### 2. Configurar el Backend

1. Navegar al directorio del backend:
```bash
cd new-back
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la base de datos:
   - Crear una base de datos en PostgreSQL
   - Copiar el archivo `.env.example` a `.env` y configurar las variables con tus credenciales:
   ```
   DB_HOST=tu_host
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=tu_base_de_datos
   PORT=5000
   ```

4. Ejecutar las migraciones:
```bash
npx sequelize-cli db:migrate
```

5. (Opcional) Cargar datos de ejemplo:
```bash
npx sequelize-cli db:seed:all
```

6. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### 3. Configurar el Frontend

1. Abrir una nueva terminal y navegar al directorio del frontend:
```bash
cd new-front
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar las variables de entorno:
   - Crear un archivo `.env` en la carpeta `new-front` con el siguiente contenido:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Iniciar el servidor de desarrollo:
```bash
npm start
```

## Acceso a la Aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Características Principales

- Gestión de presupuestos por categoría
- Registro y seguimiento de gastos
- Filtrado y ordenamiento de gastos
- Exportación de datos
- Sistema de alertas para excesos de presupuesto
- Interfaz responsiva y moderna

## Scripts Disponibles

### Backend
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Compila el proyecto
- `npm start`: Inicia el servidor en modo producción
- `npm run test`: Ejecuta las pruebas

### Frontend
- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto para producción
- `npm test`: Ejecuta las pruebas
- `npm run eject`: Expone la configuración de webpack

## Solución de Problemas Comunes

1. **Error de conexión a la base de datos**
   - Verificar que PostgreSQL esté corriendo
   - Comprobar las credenciales en el archivo `.env`
   - Asegurarse de que la base de datos existe
   - Verificar que el puerto de PostgreSQL esté disponible

2. **Errores de CORS**
   - Verificar que las URLs en el frontend coincidan con el backend
   - Comprobar la configuración de CORS en el backend

3. **Errores de compilación**
   - Limpiar la caché: `npm clean-cache --force`
   - Eliminar node_modules y reinstalar: `rm -rf node_modules && npm install`

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles.

## Contacto

Para soporte o consultas, por favor abrir un issue en el repositorio. 