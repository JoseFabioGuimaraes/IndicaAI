# Indica.ai

Indica.ai is a robust platform designed to manage and evaluate employee performance using AI-driven analysis. The system is built upon a **Microservices Architecture**, integrating a Next.js frontend, a Spring Boot API, and specialized Python workers for biometric and document validation.

## 🏗️ Microservices Architecture & RabbitMQ

The core strength of Indica.ai lies in its decoupled architecture, which ensures scalability and resilience. **RabbitMQ** serves as the backbone for asynchronous communication, orchestrating the flow of data between the main API and the AI workers.

### How it Works:

1.  **Event-Driven Communication**: When a worker submits documents or data, the **Spring Boot API** publishes a message to a specific RabbitMQ queue.
2.  **Specialized Workers**:
    *   **Triagem Worker**: Consumes messages to perform initial document validation and triage.
    *   **Biometria Worker**: Consumes messages to execute advanced facial recognition and biometric analysis.
3.  **Asynchronous Processing**: This setup allows heavy AI processing tasks to run independently without blocking the main user interface or API, ensuring a smooth user experience.

## 🚀 Services Overview

The project is composed of the following services:

-   **Frontend (`avalai-frontend`)**: Built with **Next.js**, providing the user interface for companies and workers.
-   **API (`avalai-api`)**: A **Spring Boot** application acting as the core backend, managing business logic, database interactions, and authentication.
-   **Database (`avalai-postgres`)**: **PostgreSQL** database for storing application data.
-   **Message Broker (`avalai-rabbitmq`)**: **RabbitMQ** for asynchronous communication between the API and microservices.
-   **Triagem Worker (`avalai-worker-triagem`)**: A **Python** microservice responsible for initial document validation.
-   **Biometria Worker (`avalai-worker-biometria`)**: A **Python** microservice performing facial recognition.

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aval.ai
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory of the project. You can use the example below:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=minha_app_db

# RabbitMQ Configuration
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest

# Mail Configuration (e.g., Mailtrap)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password

# Security
JWT_SECRET=your_secure_jwt_secret
```

> **Note:** The `.env` file is git-ignored for security. Make sure to provide valid credentials, especially for the Mail service if you want to receive email notifications.

### 3. Run the Application

Start all services using Docker Compose:

```bash
docker compose up --build
```

This command will build the images and start the containers. The first run might take a few minutes.

## 🔌 Accessing the Services

Once the application is running, you can access the services at:

-   **Frontend**: [http://localhost:3000](http://localhost:3000)
-   **API**: [http://localhost:8080](http://localhost:8080)
-   **RabbitMQ Management**: [http://localhost:15672](http://localhost:15672) (User: `guest`, Pass: `guest`)

## 📂 Project Structure

```
aval.ai/
├── API/                 # Spring Boot Backend
├── indica.ai/           # Next.js Frontend
├── Microservice/        # Python Workers
│   ├── lockeAI/         # Triagem Worker
│   └── reconhecimento-AI/ # Biometria Worker
├── docker-compose.yml   # Docker Orchestration
├── .env                 # Environment Variables (Not committed)
└── README.md            # Project Documentation
```

## 📝 Usage

1.  **Register**: Create a Company or Worker account via the Frontend.
2.  **Login**: Access your profile.
3.  **Companies**: Can search for workers and submit evaluations.
4.  **Workers**: Can view their profile, evaluations, and submit documents for AI validation.

## 🌟 Credits

Developed by **[@jfabioguimaraes](https://github.com/josefabioguimaraes)**.
