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
