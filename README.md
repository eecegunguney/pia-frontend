# 🌐 Telecom Customer Inventory Analytics System

![Project Status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-25-orange?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.16-brightgreen?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16--alpine-336791?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📚 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Progress](#development-progress)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

An **enterprise-grade** telecom customer inventory analytics system designed with production-ready infrastructure, scalable architecture, and comprehensive database management capabilities.

### Key Features

✨ **Monorepo Architecture** - Unified backend, frontend, and infrastructure management  
🔐 **Security-First** - Centralized secret management with environment variables  
🗄️ **Database-Driven** - Containerized PostgreSQL with automatic ORM schema generation  
🐳 **Infrastructure as Code** - Docker Compose for seamless deployment  
📊 **Analytics Ready** - Built for real-time customer inventory analysis  

---

## 🏗️ Architecture

### Monorepo Structure

```
telecom-customer-inventory-analytics-system/
├── backend/              # Spring Boot 3.5.16 REST API
├── frontend/            # (Coming Soon) Frontend Application
├── docker/              # Docker Compose Infrastructure
├── docs/                # Documentation
├── .env                 # Environment Configuration (Secrets)
├── .gitignore           # Git Ignore Rules
└── README.md            # This File
```

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Java | 25 |
| **Framework** | Spring Boot | 3.5.16 |
| **Database** | PostgreSQL | 16-alpine |
| **Container** | Docker & Docker Compose | Latest |
| **IDE** | IntelliJ IDEA | Latest |
| **Version Control** | Git & GitHub | - |

---

## 📁 Project Structure

### Backend (`/backend`)

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/pia/inventory/
│   │   │   ├── TelecomCustomerInventoryAnalyticsSystemApplication.java
│   │   │   └── config/
│   │   │       └── EnvironmentConfig.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application.properties
│   └── test/
│       └── java/com/pia/inventory/
├── docker/
│   └── docker-compose.yml
├── pom.xml              # Maven Configuration
├── mvnw & mvnw.cmd      # Maven Wrapper (Platform-independent)
└── README.md            # Backend Documentation
```

### Key Configuration Files

- **`application.yml`** - Spring Boot configuration with environment variable mapping
- **`application.properties`** - Alternative properties format
- **`docker-compose.yml`** - PostgreSQL containerization
- **`.env`** - Secrets & credentials (ROOT LEVEL - Not committed to Git)

---

## 🚀 Getting Started

### Prerequisites

- ✅ Java 25 (or latest)
- ✅ Maven 3.8+
- ✅ Docker & Docker Compose
- ✅ Git
- ✅ IntelliJ IDEA (Recommended)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd telecom-customer-inventory-analytics-system
```

### 2. Configure Environment Variables

Create a `.env` file in the **root directory** with the following:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=inventory_db
POSTGRES_PORT=5432
DB_URL=jdbc:postgresql://postgres:5432/inventory_db
```

⚠️ **IMPORTANT:** Never commit `.env` to version control!

### 3. Start the Database

```powershell
# From the root directory
cd docker
docker compose --env-file ../.env up -d
```

Or directly from root:

```powershell
docker compose --env-file ./.env -f docker/docker-compose.yml up -d
```

### 4. Configure IntelliJ IDEA

1. Open `telecom-customer-inventory-analytics-system` as root project
2. Right-click `backend/pom.xml` → **Add as Maven Project**
3. Configure Spring Boot Run Configuration:
   - Set **Working directory** to the root folder
   - Add **EnvFile plugin** pointing to `.env`
4. Set **Java Compiler level** to 25
5. Run the application from IntelliJ

### 5. Verify Database Connection

- Open **DBeaver**
- Create new connection to PostgreSQL:
  - Host: `localhost`
  - Port: `5432`
  - Database: `inventory_db`
  - User: (from `.env`)
  - Password: (from `.env`)

---

## 📈 Development Progress

### ✅ Day 1: Production-Ready Infrastructure & Database Connection

**Status:** COMPLETED ✓

**Achievements:**
- ✅ Enterprise monorepo structure established
- ✅ Spring Boot 3.5.16 backend scaffolded
- ✅ PostgreSQL containerization via Docker
- ✅ Environment-based configuration management
- ✅ Database connectivity verified
- ✅ IDE workspace synchronization

**Key Documentation:** [Backend README](./backend/README.md)

### 🔄 Day 2: Domain Model Development & API Implementation (In Progress)

**Planned Tasks:**
- [ ] Entity modeling for customer inventory
- [ ] JPA/Hibernate ORM implementation
- [ ] REST API endpoints design
- [ ] Service layer implementation
- [ ] Repository pattern setup

### 📋 Day 3-4: Advanced Features (Planned)

- [ ] Analytics & Reporting API
- [ ] Frontend Integration
- [ ] Authentication & Authorization
- [ ] Testing Suite
- [ ] CI/CD Pipeline

---

## 🛠️ Development Workflow

### Running the Backend

```bash
# Maven command (from backend directory)
mvn spring-boot:run

# Or use IntelliJ IDEA Run button
```

### Building for Production

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/telecom-customer-inventory-analytics-system-0.0.1-SNAPSHOT.jar
```

### Database Commands

```powershell
# View database logs
docker compose -f docker/docker-compose.yml logs postgres

# Connect to database
docker exec -it <container_id> psql -U admin -d inventory_db

# Stop containers
docker compose -f docker/docker-compose.yml down
```

---

## 🔐 Security Best Practices

✅ **Secrets Management**
- Credentials stored in `.env` (root level)
- Environment variables injected at runtime
- No hardcoded passwords in source code

✅ **Repository Protection**
- `.gitignore` explicitly blocks `.env` files
- `.env.example` provided for team reference

✅ **Database Security**
- PostgreSQL Alpine (lightweight, secure)
- Container network isolation
- Dynamic configuration binding

---

## 📞 Support & Documentation

For detailed information about Day 1 implementation, see: [Backend Documentation](./backend/README.md)

For issues or questions:
1. Check existing documentation
2. Review the backend README
3. Check Docker/database logs
4. Consult the troubleshooting section

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

**Project Lead:** Development Team

**Technologies Used:** Java | Spring Boot | PostgreSQL | Docker | Maven | Git

---

**Last Updated:** 2024 | **Status:** Day 1 Completed ✅
