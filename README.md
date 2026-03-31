#  GardenManager

Plataforma web para la gestión integral de servicios de una empresa de jardinería. Desarrollada como Trabajo de Fin de Grado del ciclo formativo de Desarrollo de Aplicaciones Multiplataforma (DAM).

##  Descripción

GardenManager permite digitalizar y centralizar la gestión de clientes, servicios y trabajadores de una empresa de jardinería. El sistema cuenta con autenticación segura mediante JWT y una interfaz moderna y responsive.

##  Tecnologías utilizadas

### Backend
- Java 21
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL 18
- Maven
- Lombok

### Frontend
- Angular 21
- TypeScript
- Tailwind CSS

##  Requisitos previos

- Java 21
- Node.js 20+
- PostgreSQL 18
- Angular CLI

##  Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/GardenManager.git
cd GardenManager
```

### 2. Configurar la base de datos

Crear una base de datos en PostgreSQL llamada `gardenmanager` y configurar las credenciales en `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gardenmanager
spring.datasource.username=postgres
spring.datasource.password=tu_contraseña
```

### 3. Arrancar el backend
```bash
cd backend
./mvnw spring-boot:run
```

El servidor arrancará en `http://localhost:8080`

### 4. Arrancar el frontend
```bash
cd frontend
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

##  Autenticación

Para acceder a la plataforma es necesario registrar primero un usuario administrador mediante la API:
```
POST http://localhost:8080/api/auth/registro
{
    "username": "admin",
    "password": "tu_contraseña",
    "rol": "ADMIN"
}
```

##  Estructura del proyecto
```
GardenManager/
├── backend/                  # API REST con Spring Boot
│   └── src/main/java/com/gardenmanager/backend/
│       ├── controller/       # Controladores REST
│       ├── model/            # Entidades JPA
│       ├── repository/       # Repositorios de datos
│       ├── service/          # Lógica de negocio
│       └── security/         # Configuración JWT
└── frontend/                 # Aplicación Angular
    └── src/app/
        ├── components/       # Pantallas de la aplicación
        ├── services/         # Servicios HTTP
        ├── models/           # Interfaces TypeScript
        └── guards/           # Protección de rutas
```

##  Funcionalidades

-  Autenticación con JWT
-  Gestión de clientes (CRUD completo)
-  Gestión de servicios de jardinería (CRUD completo)
-  Gestión de trabajadores (CRUD completo)
-  Panel de administración con resumen general
-  Estados de servicios (Pendiente, En proceso, Finalizado)

##  Autor

Enrique Panadero — TFG DAM
