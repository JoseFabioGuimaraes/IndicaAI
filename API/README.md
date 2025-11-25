# Aval.AI - Employee Evaluation System

## 📋 Description

Employee evaluation system with biometric validation developed in Spring Boot. The system allows companies to evaluate their employees and employees to respond to received evaluations, with a focus on security and robust authentication.

## 🚀 Technologies Used

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Security** - Security and authentication
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Database
- **Flyway** - Database migration
- **RabbitMQ** - Messaging (AMQP)
- **JWT (Auth0)** - Token-based authentication
- **Lombok** - Boilerplate code reduction
- **SpringDoc OpenAPI** - API documentation
- **Spring Mail** - Email sending
- **Docker Compose** - Containerization
- **Spring Dotenv** - Environment variables management

## 🏗️ Architecture

The project follows a well-defined layered architecture:

```
src/main/java/br/com/indicaAI/API/
├── controllers/          # Presentation layer (REST Controllers)
│   ├── autenticacao/    # Login and authentication endpoints
│   ├── avaliacao/       # Evaluation endpoints
│   ├── empresa/         # Company endpoints
│   └── funcionario/     # Employee endpoints
├── domain/              # Domain layer (business rules)
│   ├── autenticacao/    # Authentication services
│   ├── avaliacao/       # Evaluation entities and services
│   ├── empresa/         # Company entities and services
│   ├── funcionario/     # Employee entities and services
│   └── shared/          # Shared components
└── infrastructure/      # Infrastructure layer
    ├── exceptions/      # Exception handling
    ├── rabbitmq/       # RabbitMQ configuration
    └── security/       # Security configurations
```

## 📊 Data Model

### Main Entities

- **Companies**: Store registered company data
- **Employees**: Employee data, including photos for biometric validation
- **Evaluations**: Evaluation system with scores in three dimensions

### Evaluation System

Evaluations are based on three main criteria:
- **Attendance**: Punctuality and frequency
- **Technical**: Technical competencies
- **Behavioral**: Interpersonal skills

## 🔐 Security

- **JWT Authentication**: Secure tokens for authentication
- **Spring Security**: Access control and authorization
- **Biometric Validation**: Face and document photos for verification
- **Password Encryption**: Passwords are stored securely

## 🛠️ Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose
- External RabbitMQ service (managed by Python service)

## 🚀 How to Run

### Option 1: Docker Setup (Recommended)

#### 1. Configure environment variables (Optional)
Edit the environment variables in `docker-compose.yml` if needed:
- Email settings (MAIL_HOST, MAIL_USER, MAIL_PASS)  
- JWT secret key (JWT_SECRET)

#### 2. Start all services
```bash
docker compose up -d --build
```

This will start:
- PostgreSQL database on port 5432
- Spring Boot application on port 8080

**Note**: RabbitMQ is managed by an external Python service and needs to be started separately.

#### 3. Access the application
- **API**: http://localhost:8080
- **Swagger Documentation**: http://localhost:8080/swagger-ui.html

#### 4. Useful commands
```bash
# Check services status
docker compose ps

# View logs
docker compose logs app

# Stop services
docker compose down
```

### Option 2: Local Development

#### 1. Start only PostgreSQL
```bash
docker compose up -d db
```

#### 2. Configure environment variables
Copy `.env.example` to `.env` and adjust as needed.

#### 3. Run the application
```bash
./mvnw spring-boot:run
```

## 📚 Main Endpoints

### Authentication
- `POST /login` - Login (companies and employees)

### Evaluations
- `POST /avaliacoes/criar` - Create new evaluation (company)
- `POST /avaliacoes/{id}/responder` - Respond to evaluation (employee)
- `GET /avaliacoes/minhas` - View own evaluations (employee)

### Companies
- Endpoints for company management

### Employees
- Endpoints for employee management

## 🗄️ Database

The project uses Flyway for database migration. Migrations are located at `src/main/resources/db/migration/`:

- `V1__create-tables-inicial.sql` - Main tables creation
- `V2__alter-table-empresas-add-nome-fantasia.sql` - Add company trade name
- `V3__alter-table-funcionarios-fotos-large.sql` - Adjust photo fields
- `V4__alter-table-funcionarios-remove-lob.sql` - Remove LOB
- `V5__alter-table-avaliacoes-add-resposta.sql` - Add response system

## 📨 Messaging System

The project uses RabbitMQ for asynchronous task processing, such as:
- Email notification sending
- Biometric validation processing
- Audit logs

**Important**: RabbitMQ is managed by an external Python service. Configure the connection in your `.env` file:

```env
RABBITMQ_HOST=localhost  # or host.docker.internal for Docker
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
```

## 📦 Production Build

```bash
./mvnw clean package
```

The JAR will be generated at `target/API-0.0.1-SNAPSHOT.jar`

## 🐳 Docker

The project includes a complete Docker setup with:

### Services
- **PostgreSQL**: Database with health checks
- **Spring Boot App**: Fully containerized application
- **RabbitMQ**: External service managed by Python microservice

### Files
- `docker-compose.yml`: Complete orchestration setup
- `Dockerfile`: Multi-stage build for Spring Boot app
- `.dockerignore`: Optimized build context

### Useful Commands
```bash
# Start all services
docker compose up -d --build

# View logs
docker compose logs -f app

# Restart only the app
docker compose restart app

# Stop and clean up
docker compose down
```

### Network
All services run on the `avalai-network` bridge network for secure inter-service communication.


## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Team

Developed by the @jfabioguimaraes

---

For more information about the API, consult the Swagger documentation available at `/swagger-ui.html` when the application is running.
