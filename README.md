# 🏀 Basketball Scoreboard - OpenShift Deployment

## Pasos para Desplegar en OpenShift Sandbox

### 1. Preparar el Código
Este directorio contiene una versión simplificada de nuestro Basketball Scoreboard optimizada para OpenShift.

### 2. Crear Repositorio en GitHub
1. Ve a GitHub y crea un nuevo repositorio público
2. Sube estos archivos al repositorio

### 3. Desplegar en OpenShift Sandbox

#### Opción A: Desde la Consola Web de OpenShift
1. Ve a https://sandbox.redhat.com/
2. Inicia sesión con tu cuenta
3. Haz clic en "Developer" en la barra lateral izquierda
4. Selecciona "+Add" 
5. Elige "From Git"
6. Pega la URL de tu repositorio de GitHub
7. OpenShift detectará automáticamente que es una aplicación Node.js
8. Haz clic en "Create"

#### Opción B: Usando oc CLI (Línea de Comandos)
```bash
# 1. Instalar oc CLI desde https://console.redhat.com/openshift/downloads

# 2. Hacer login (copia el comando desde la consola web)
oc login --token=sha256~xxx --server=https://api.sandbox-m3.1530.p1.openshiftapps.com:6443

# 3. Crear nueva aplicación desde Git
oc new-app https://github.com/TU_USUARIO/basketball-openshift.git --name=basketball-app

# 4. Exponer el servicio
oc expose svc/basketball-app

# 5. Ver la URL de tu aplicación
oc get route basketball-app
```

### 4. Verificar el Despliegue
- Tu aplicación estará disponible en una URL como:
  `https://basketball-app-TU_USUARIO-dev.apps.sandbox-m3.1530.p1.openshiftapps.com`

### 5. Características de la Aplicación
- ✅ Frontend responsivo con diseño moderno
- ✅ API REST funcional con datos de equipos, jugadores y partidos
- ✅ Estadísticas en tiempo real
- ✅ Interfaz interactiva
- ✅ Optimizada para OpenShift

### Estructura del Proyecto
```
openshift-simple/
├── package.json          # Dependencias Node.js
├── server.js             # Servidor Express con API
├── public/
│   └── index.html        # Frontend de la aplicación
└── README.md            # Este archivo
```

### Comandos Útiles
```bash
# Ver el estado de los pods
oc get pods

# Ver logs de la aplicación
oc logs -f deployment/basketball-app

# Escalar la aplicación
oc scale deployment basketball-app --replicas=2

# Ver información de la ruta
oc describe route basketball-app
```

### Troubleshooting
- Si la aplicación no inicia, verifica los logs con `oc logs`
- Asegúrate de que el puerto en server.js sea `process.env.PORT || 8080`
- OpenShift asigna automáticamente un puerto, no uses puertos fijos

### Próximos Pasos
Una vez que tengas esta versión funcionando, puedes:
1. Agregar base de datos PostgreSQL
2. Implementar autenticación
3. Agregar más funcionalidades del proyecto original
4. Configurar CI/CD con GitHub Actions

# 🏀 Basketball Scoreboard - Sistema de Gestión Completo

## 📋 Descripción

**Basketball Scoreboard** es una aplicación web completa y dinámica para la gestión integral de ligas de basketball. Desarrollada con tecnologías modernas, incluye autenticación JWT, gestión de usuarios con roles, y persistencia de datos. Diseñada específicamente para demostrar funcionalidades no estáticas y desplegable en OpenShift Sandbox.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Autenticación JWT** completa y funcional
- **Roles de usuario**: Admin, Coach, User
- **Cambio de contraseñas** dinámico
- **Gestión de usuarios** (solo administradores)
- **Tokens con expiración** (24 horas)

### 📊 Gestión de Datos Dinámica
- **Equipos**: Crear, visualizar, gestionar estadísticas
- **Jugadores**: Agregar jugadores con estadísticas detalladas
- **Partidos**: Programar y actualizar resultados
- **Estadísticas**: Cálculos automáticos en tiempo real
- **Persistencia**: Los datos se mantienen entre reinicios

### 🎨 Interfaz de Usuario
- **Panel de administración** completo
- **Diseño responsive** moderno
- **Credenciales dinámicas** que se actualizan automáticamente
- **Interfaz intuitiva** con roles diferenciados
- **Estadísticas visuales** en tiempo real

### 💾 Persistencia de Datos
- **Archivo JSON** para almacenamiento local
- **Auto-guardado** en todas las operaciones
- **Datos persistentes** entre reinicios del servidor
- **Carga automática** al iniciar la aplicación

## 🏗️ Arquitectura Técnica

### Backend (Node.js + Express)
```
├── Autenticación JWT
├── Middleware de autorización por roles
├── API REST completa (CRUD)
├── Sistema de persistencia con JSON
├── Validación de datos
└── Manejo de errores robusto
```

### Frontend (HTML5 + CSS3 + JavaScript)
```
├── Panel de login dinámico
├── Dashboard administrativo
├── Gestión de usuarios, equipos, jugadores
├── Creación y gestión de partidos
├── Estadísticas en tiempo real
└── Interfaz responsive
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Instalación Local

```bash
# Clonar el repositorio
git clone <repository-url>
cd basketball-scoreboard

# Instalar dependencias
npm install

# Ejecutar la aplicación
npm start

# Acceder a la aplicación
# http://localhost:8080 - Página principal
# http://localhost:8080/admin.html - Panel de administración
```

### Credenciales por Defecto
```
Administrador: admin / hello
Entrenador:    coach / hello  
Usuario:       user / hello
```

## 🔧 Funcionalidades Dinámicas (No Estáticas)

### ✅ Autenticación Real
- Login/logout funcional con JWT
- Validación de credenciales en tiempo real
- Tokens con expiración automática
- Redirección basada en roles

### ✅ Gestión de Datos CRUD
- **Crear**: Usuarios, equipos, jugadores, partidos
- **Leer**: Visualización dinámica de todos los datos
- **Actualizar**: Contraseñas, resultados de partidos
- **Eliminar**: Funcionalidad implementada (soft delete)

### ✅ Cálculos Dinámicos
- Estadísticas que se recalculan automáticamente
- Contadores de jugadores por equipo
- Récords de victorias/derrotas actualizados
- Promedios de puntos en tiempo real

### ✅ Persistencia Real
- Los datos se guardan automáticamente
- Supervivencia a reinicios del servidor
- Archivo `data.json` como base de datos local
- Carga automática al iniciar

## 🌐 Despliegue en OpenShift

### Método Recomendado: Consola Web

1. **Acceso a OpenShift Sandbox**
   ```
   URL: https://developers.redhat.com/developer-sandbox
   Crear cuenta gratuita si no tienes una
   ```

2. **Configuración del Proyecto**
   ```
   - Vista: Developer
   - Proyecto: Crear nuevo o usar existente
   - Método: Import from Git
   ```

3. **Configuración de la Aplicación**
   ```
   Git Repository: <tu-repositorio-github>
   Builder Image: Node.js
   Application Name: basketball-scoreboard
   Name: basketball-scoreboard
   ```

4. **Variables de Entorno**
   ```
   PORT: 8080
   JWT_SECRET: basketball-secret-key-2024
   NODE_ENV: production
   ```

5. **Recursos Recomendados**
   ```
   CPU Request: 100m
   CPU Limit: 500m
   Memory Request: 128Mi
   Memory Limit: 512Mi
   ```

### Método Alternativo: CLI

```bash
# Login a OpenShift
oc login --token=<your-token> --server=<your-server>

# Crear aplicación desde Git
oc new-app nodejs~<repository-url> --name=basketball-scoreboard

# Configurar variables de entorno
oc set env deployment/basketball-scoreboard PORT=8080 JWT_SECRET=basketball-secret-key-2024

# Exponer servicio
oc expose svc/basketball-scoreboard

# Obtener URL pública
oc get route basketball-scoreboard
```

## 📡 API Endpoints

### Autenticación
```
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Crear usuario (admin only)
PUT  /api/auth/change-password # Cambiar contraseña
```

### Datos Públicos
```
GET /api/teams         # Obtener equipos
GET /api/players       # Obtener jugadores  
GET /api/games         # Obtener partidos
GET /api/stats         # Estadísticas generales
GET /api/credentials   # Credenciales actuales
GET /api/health        # Estado del servidor
```

### Datos Protegidos (Requieren Autenticación)
```
POST /api/teams        # Crear equipo (coach/admin)
POST /api/players      # Crear jugador (coach/admin)
POST /api/games        # Crear partido (coach/admin)
PUT  /api/games/:id    # Actualizar resultado (coach/admin)
GET  /api/users        # Listar usuarios (admin only)
```

## 🔒 Seguridad Implementada

### Autenticación JWT
- Tokens firmados con secreto seguro
- Expiración automática (24h)
- Validación en cada request protegido
- Headers de autorización estándar

### Autorización por Roles
- **Admin**: Acceso completo, gestión de usuarios
- **Coach**: Gestión de equipos, jugadores, partidos
- **User**: Solo lectura de datos públicos

### Validación de Datos
- Validación de entrada en todos los endpoints
- Sanitización de datos de usuario
- Manejo seguro de errores
- Prevención de inyección de datos

## 🧪 Pruebas de Funcionalidad

### Para Demostrar que NO es Estático:

1. **Prueba de Autenticación**
   ```
   1. Login con admin/hello
   2. Cambiar contraseña a "nueva123"
   3. Logout y login con nueva contraseña
   4. Verificar que las credenciales mostradas cambiaron
   ```

2. **Prueba de Persistencia**
   ```
   1. Crear nuevo equipo "Rockets"
   2. Agregar jugador al equipo
   3. Reiniciar servidor
   4. Verificar que los datos persisten
   ```

3. **Prueba de Cálculos Dinámicos**
   ```
   1. Crear partido Lakers vs Rockets
   2. Actualizar resultado 110-95
   3. Verificar que estadísticas se actualizan
   4. Comprobar récords de victorias/derrotas
   ```

## 📊 Tecnologías y Dependencias

### Backend
```json
{
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2", 
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5"
}
```

### Frontend
- HTML5 semántico
- CSS3 con Grid y Flexbox
- JavaScript ES6+ (Vanilla)
- Fetch API para comunicación con backend

### Deployment
- OpenShift compatible
- Docker containerization
- Node.js 18 runtime
- Persistent volume para datos

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error 401 - Unauthorized**
   ```
   Causa: Token JWT inválido o expirado
   Solución: Logout y login nuevamente
   ```

2. **Datos no Persisten**
   ```
   Causa: Permisos de escritura en contenedor
   Solución: Verificar permisos del directorio
   ```

3. **Error de Conexión**
   ```
   Causa: Puerto incorrecto o servicio no disponible
   Solución: Verificar configuración de puerto (8080)
   ```

### Logs de Debugging

```bash
# OpenShift logs
oc logs deployment/basketball-scoreboard -f

# Estado de pods
oc get pods -l app=basketball-scoreboard

# Eventos del proyecto
oc get events --sort-by=.metadata.creationTimestamp
```

## 📈 Métricas de Rendimiento

### Recursos de Servidor
- **Tiempo de inicio**: ~3-5 segundos
- **Memoria base**: ~50MB
- **CPU idle**: ~5-10%
- **Tamaño de datos**: ~10KB (JSON)

### Rendimiento Web
- **Tiempo de carga**: <2 segundos
- **Tamaño de página**: ~50KB
- **Requests por página**: 3-5
- **Compatibilidad**: Chrome, Firefox, Safari, Edge

## 🤝 Contribución

### Proceso de Desarrollo
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Desarrollar y probar cambios
4. Commit con mensajes descriptivos
5. Push y crear Pull Request

### Estándares de Código
- ESLint para JavaScript
- Prettier para formateo
- Comentarios en funciones complejas
- Tests unitarios recomendados

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver archivo `LICENSE` para más detalles.

## 👨‍💻 **Información del Estudiante**

- **Nombre:** Manuel Alejandro Sazo Linares
- **Carnet:** 7690-20-13585
- **Curso:** Seminario
- **Proyecto:** Basketball Scoreboard - Sistema de Gestión Completo

## 🌐 **APLICACIÓN DESPLEGADA Y FUNCIONANDO**

### ✅ **URL de la Aplicación en OpenShift:**
```
🏀 Página Principal: 
http://basketball-scoreboard-route-msazol1-dev.apps.rm2.thpm.p1.openshiftapps.com

👑 Panel de Administración:
http://basketball-scoreboard-route-msazol1-dev.apps.rm2.thpm.p1.openshiftapps.com/admin.html
```

### 🔑 **Credenciales de Acceso:**
```
🔐 Administrador: admin / hello
🏃 Entrenador:    coach / hello  
👤 Usuario:       user / hello
```

### 🧪 **Pruebas para Demostrar Funcionalidad Dinámica:**

#### **Prueba 1: Persistencia de Sesión**
1. Login con `admin` / `hello`
2. Presionar **Ctrl+R** (refrescar página)
3. ✅ **Resultado:** Mantiene la sesión activa

#### **Prueba 2: Cambio de Contraseñas Dinámico**
1. Ir a "🔐 Cambiar Contraseña"
2. Cambiar de `hello` a `nueva123`
3. ✅ **Resultado:** Las credenciales se actualizan automáticamente

#### **Prueba 3: Creación de Datos**
1. Crear nuevo equipo "Rockets"
2. Agregar jugador "James Harden" al equipo
3. Crear partido Lakers vs Rockets
4. ✅ **Resultado:** Estadísticas se recalculan automáticamente

#### **Prueba 4: Persistencia de Datos**
1. Crear datos nuevos
2. Refrescar página múltiples veces
3. ✅ **Resultado:** Los datos persisten

## 📊 **Estado del Despliegue**

### ✅ **OpenShift Sandbox - FUNCIONANDO**
- **Namespace:** msazol1-dev
- **Deployment:** basketball-scoreboard
- **Service:** basketball-scoreboard-service  
- **Route:** basketball-scoreboard-route
- **Pod Status:** Running ✅
- **Logs:** Servidor iniciado correctamente ✅

### 🏗️ **Arquitectura Desplegada**
```
Internet → OpenShift Route → Service → Pod → Node.js App
                                      ↓
                                 data.json (persistencia)
```

## 📞 Soporte y Contacto

- **Estudiante**: Manuel Alejandro Sazo Linares (7690-20-13585)
- **Repositorio**: https://github.com/AlejandroSazo00/Laboratorio3-Seminario
- **Aplicación en OpenShift**: http://basketball-scoreboard-route-msazol1-dev.apps.rm2.thpm.p1.openshiftapps.com
- **Panel Admin**: http://basketball-scoreboard-route-msazol1-dev.apps.rm2.thpm.p1.openshiftapps.com/admin.html

---

## 🎯 Resumen Ejecutivo

**Basketball Scoreboard** es una aplicación web **completamente funcional y dinámica** que demuestra:

✅ **Autenticación JWT real** con roles diferenciados  
✅ **Persistencia de datos** entre reinicios  
✅ **Operaciones CRUD** completas y funcionales  
✅ **Cálculos dinámicos** en tiempo real  
✅ **Interfaz responsive** moderna  
✅ **API REST** robusta y documentada  
✅ **Despliegue en OpenShift** optimizado  

**No es una aplicación estática** - todos los datos son modificables, persistentes y calculados dinámicamente, cumpliendo con los requisitos de funcionalidad completa para entornos de producción.
