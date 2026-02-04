# Yamaha Backend API

Backend API para la prueba técnica de Yamaha, gestionando ventas de motocicletas y procesamiento de archivos CSV/TXT.

## 🚀 Características

- **RESTful API** con Express.js
- **Base de datos PostgreSQL** con conexión pool
- **Upload de archivos** (CSV/TXT) con validación
- **Procesamiento batch** de ventas desde archivos
- **Validación de datos** con Joi
- **Manejo de errores** centralizado
- **CORS** configurado para frontend
- **Logging** con Morgan

## 📋 Prerrequisitos

- Node.js 16+
- PostgreSQL 12+
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales de PostgreSQL:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=yamaha_test
   DB_USER=postgres
   DB_PASSWORD=tu_password
   ```

4. **Crear base de datos**
   ```sql
   CREATE DATABASE yamaha_test;
   ```

## 🏃‍♂️ Ejecutar la aplicación

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

## 📁 Estructura del proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # Configuración PostgreSQL
│   ├── controllers/
│   │   └── ventasController.js  # Lógica de negocio
│   ├── middleware/
│   │   ├── errorHandler.js      # Manejo de errores
│   │   ├── upload.js            # Configuración Multer
│   │   └── validation.js        # Validación Joi
│   ├── routes/
│   │   └── ventas.js            # Rutas de la API
│   └── index.js              # Punto de entrada
├── uploads/                  # Archivos subidos (temporal)
├── package.json
└── README.md
```

## 🔗 Endpoints

### Ventas

#### Crear venta individual
```http
POST /api/v1/ventas
Content-Type: application/json

{
  "documento": "12345678",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "email": "juan@example.com",
  "celular": "3001234567",
  "motor": "MT071234",
  "modelo_id": 1,
  "cilindraje": 689,
  "color": "Azul",
  "fecha_ensamble": "2023-01-15",
  "anio_modelo": 2023,
  "factura_num": "F001",
  "precio": 8500000,
  "fecha": "2023-12-01",
  "ciudad": "Bogotá",
  "tienda": "Yamaha Centro",
  "vendedor": "Carlos Rodríguez"
}
```

#### Procesar archivo de ventas (CSV/TXT)
```http
POST /api/v1/ventas/batch
Content-Type: multipart/form-data

file: [archivo.csv o archivo.txt]
```

**Formato del archivo CSV:**
```csv
documento,nombres,apellidos,email,direccion,fecha_nacimiento,genero,celular,motor,modelo_id,cilindraje,color,fecha_ensamble,anio_modelo,factura_num,precio,fecha,ciudad,tienda,vendedor
12345678,Juan,Pérez,juan@example.com,,1985-05-15,M,3001234567,MT071234,1,689,Azul,2023-01-15,2023,F001,8500000,2023-12-01,Bogotá,Yamaha Centro,Carlos Rodríguez
```

### Health Check
```http
GET /health
```

## 🗄️ Base de datos

La aplicación crea automáticamente las siguientes tablas:

- **clientes**: Información de clientes
- **modelos**: Modelos de motocicletas
- **vehiculos**: Detalles de vehículos específicos
- **ventas**: Registros de ventas

## 📝 Logs

La aplicación utiliza Morgan para logging de peticiones HTTP en formato combined.

## 🛡️ Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Configurado para el frontend
- **Validación**: Joi para todos los datos de entrada
- **File upload**: Validación de tipo y tamaño de archivo

## 🧪 Testing

```bash
npm test
```

## 📦 Deploy

Para producción:

1. Configurar variables de entorno
2. Asegurar que PostgreSQL esté accesible
3. Ejecutar `npm start`

## 🔧 Troubleshooting

### Error de conexión a PostgreSQL
- Verificar que PostgreSQL esté corriendo
- Confirmar credenciales en `.env`
- Asegurar que la base de datos exista

### Error al subir archivos
- Verificar tamaño máximo (10MB por defecto)
- Confirmar formato (CSV/TXT)
- Revisar permisos de la carpeta `uploads/`

## 📞 Soporte

Para issues o preguntas, contactar al equipo de desarrollo.
