# 🚀 Day 1: Project Infrastructure Setup & Database Integration

## 📌 Day 1 Objective

The primary objective of the first day was to establish a secure, portable, and team-friendly development environment.

During this phase:

- ✅ Project infrastructure was established
- ✅ Backend project was initialized
- ✅ Database environment was virtualized with Docker
- ✅ Secure configuration system was implemented
- ✅ Backend-PostgreSQL connection was successfully verified

---

## 🛠️ Development Environment Setup

### Installed Technologies

| Technology | Version |
|-----------|---------|
| Java | 25 |
| Spring Boot | 3.5.x |
| PostgreSQL | 16-alpine |
| Docker | Latest |
| IntelliJ IDEA | Latest |
| DBeaver | Latest |
| Git & GitHub | Latest |

---

## 📦 GitHub Repository Creation

Initially, a private GitHub repository was created for the project, and the basic project folder structure was prepared.

### Created Structure

```
telecom-customer-inventory-analytics-system/
├── backend/
├── frontend/
├── docker/
├── .env
├── .gitignore
└── README.md
```

This structure enables managing:
- Backend
- Frontend
- Docker
- Shared configurations

All under a single repository.

---

## ☕ Spring Boot Project Creation

The backend project was created using Spring Initializr.

### Configuration Details

| Property | Value |
|----------|-------|
| Group | com.pia.inventory |
| Language | Java |
| Build Tool | Maven |
| Java Version | 25 |

---

## 🔐 Centralized Secret Management (.env)

### What We Did

Database username, password, and port information were extracted from source code and consolidated in a central `.env` file.

**Example:**
```env
POSTGRES_DB=inventory
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password
POSTGRES_PORT=5432
```

### Why We Did It

- ✅ Prevented credentials from being stored in source code
- ✅ Eliminated security vulnerabilities
- ✅ Enabled Backend and Docker to use the same configuration
- ✅ Aligned with enterprise development standards

---

## 🚫 Repository Security (.gitignore)

### What We Did

The `.env` file was configured to be excluded from Git tracking:

```
.env
```

### Why We Did It

- ✅ Prevented accidental uploading of credentials to GitHub
- ✅ Protected sensitive information from repository leakage

---

## 🐳 Docker PostgreSQL Setup

### What We Did

PostgreSQL 16 database was initialized using Docker Compose.

**Utilized Version:**
```
postgres:16-alpine
```

### Why We Did It

Using Docker enabled us to:
- ✅ Ensure all team members use the same database environment
- ✅ Eliminate manual installation requirements
- ✅ Prevent version incompatibilities
- ✅ Create a portable infrastructure running with a single command

### Docker Container Initialization

The following command was executed via IntelliJ terminal:

```powershell
docker compose up -d
```

---

## ⚠️ Encountered Error & Resolution

### Error Message

```
Database is uninitialized and superuser password is not specified
```

### Root Cause

The `docker-compose.yml` file was located in the `docker/` directory, while the `.env` file was in the `project-root/` directory. Docker couldn't automatically read the `.env` file due to this directory mismatch.

### Applied Solution

The location of the `.env` file was explicitly specified to Docker:

```powershell
docker compose --env-file ../.env up -d
```

After this operation, the PostgreSQL container started successfully.

---

## ⚙️ Spring Boot & PostgreSQL Connection

### What We Did

The `application.properties` file was configured to read `.env` variables:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
```

### Why We Did It

This configuration ensured:
- ✅ Passwords were not stored in source code
- ✅ Entity classes were automatically converted to database tables
- ✅ Database tables were created automatically
- ✅ Dynamic environment-based configuration was achieved

---

## 📊 Database Verification with DBeaver

### What We Did

A connection to the PostgreSQL database running on Docker was established using DBeaver.

**Connection Details Provided:**
- Host
- Port
- Database
- Username
- Password

The connection test was successfully completed.

---

## 📘 IntelliJ Configuration in Monorepo Structure

### Encountered Problem

When opening the project from the outermost folder:
- ❌ Run buttons remained inactive
- ❌ IntelliJ couldn't automatically detect the backend module

When opening only the backend folder:
- ❌ `Driver claims to not accept jdbcUrl` error occurred

### Root Cause

When the backend folder was opened independently, the Java application couldn't access the `.env` file in the root directory.

### Permanent Solution

**Step 1: Open from Root Directory**
```
telecom-customer-inventory-analytics-system
```

**Step 2: Introduce Maven Module**
```
backend/pom.xml
↓
Right Click
↓
Add as Maven Project
```

**Step 3: Fix Java Version**
```
Project SDK = Java 25
Compiler Level = Java 25
```

**Step 4: Configure Working Directory**

In the Spring Boot Run Configuration:
- Set **Working Directory** to the root project folder

**Step 5: Link EnvFile**

Using IntelliJ's EnvFile plugin:
- Connect `root/.env` file to the Spring Boot application

---

## ✅ Results Achieved

Successfully:

- ✅ Java 25 development environment was established
- ✅ Spring Boot project was created
- ✅ Monorepo architecture was implemented
- ✅ PostgreSQL was initialized on Docker
- ✅ Central `.env`-based configuration was created
- ✅ DBeaver connection was verified
- ✅ Spring Boot-PostgreSQL connection was successfully established
- ✅ Test data was written to the database
- ✅ Application-database communication was verified

---

## 🎯 Day 1 Deliverables

✅ Secure configuration system established  
✅ Docker-based database infrastructure completed  
✅ Monorepo architecture functional  
✅ Backend ↔ PostgreSQL connection verified  
✅ Project prepared for Domain Development (Day 2)  

---

## 🚀 Next Phase

**Day 2: Domain Model Design & API Development**
