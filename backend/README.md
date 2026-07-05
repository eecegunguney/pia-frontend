# 🚀 Day 1: Production-Ready Infrastructure & Database Connection

## 📌 Milestone Overview

On the first day of development, the primary objective was to establish a secure, portable, and production-ready infrastructure. Following enterprise software architecture principles, we implemented a **Monorepo structure** to ensure seamless collaboration between backend, frontend, test, and DevOps layers.

---

## 🛠️ Tech Stack & Workspace Setup

| Component | Technology | Version |
|-----------|-----------|---------|
| **Language Runtime** | Java | 25 (Latest) |
| **Framework** | Spring Boot | 3.5.16 (Stable LTS) |
| **IDE** | IntelliJ IDEA | Latest |
| **Database Engine** | PostgreSQL | 16-alpine (Containerized) |
| **DB Administration** | DBeaver | Universal |
| **Version Control** | Git & GitHub | Private Monorepo |

---

## 📸 Initializing the Architecture

The base project skeleton was scaffolded using **Spring Initializr** with enterprise metadata alignments (`com.pia.inventory`).

![Enterprise Spring Boot project metadata and dependencies mapping](https://github.com/nalba/telecom-customer-inventory-analytics-system/assets/section/figure-1-metadata)

**Figure 1:** Enterprise Spring Boot project metadata and dependencies mapping

---

## 🏛️ Architectural Decisions & Implementation Matrix

### 🔐 Centralized Secret Management (.env)

**Action:**
- Extracted all database credentials, master keys, and port definitions from the source code into a root-level `.env` file

**Justification:**
- Hardcoding passwords inside source files is a critical vulnerability
- This decouples our runtime configuration from the application logic

---

### 🚫 Repository Leak Prevention (.gitignore)

**Action:**
- Explicitly blacklisted the `.env` file from Git tracking patterns

**Justification:**
- Permanently prevents accidental credential leakages to remote version control platforms

---

### 📦 Infrastructure Virtualization (Docker Compose)

**Action:**
- Containerized the PostgreSQL engine utilizing a lightweight and highly secure Alpine Linux distribution

**Justification:**
- Eliminates manual database installations on host machines
- Guarantees a unified environment across the entire engineering team

---

### 🔌 Dynamic Data Bridging (application.properties)

**Action:**
- Wired Spring Boot to dynamically map environment variables at runtime
- Enabled the update schema strategy

**Justification:**
- Automates Object-Relational Mapping (ORM) generation directly from Java Entities
- Safeguards raw connection strings

---

### 📊 Visual Data Verification (DBeaver)

**Action:**
- Initiated a structural connection tunnel between the host machine and the running Docker container

**Justification:**
- Guarantees data integrity
- Allows real-time execution profiling of SQL analytics queries

---

## 🐳 Containerized Database Deployment

The initialization of the relational storage layer was triggered through the container runtime platform.

![Container image layer retrieval and network virtualization logs](https://github.com/nalba/telecom-customer-inventory-analytics-system/assets/section/figure-2-deployment)

**Figure 2:** Container image layer retrieval and network virtualization logs

---

## ⚠️ Infrastructure Challenge & Resolution

### The Problem

During execution inside the sub-directory (`docker/`), the engine failed initialization due to missing credentials:

```
Database is uninitialized and superuser password is not specified.
```

### Root Cause

The container configuration could not automatically map the environment variables since the `.env` file was positioned one level higher in the root directory hierarchy.

### Solution

Executed an explicit context bridging command via PowerShell to dynamically feed the exact deployment paths:

```powershell
# Bypassing directory bounds by forcing explicit environment mapping
docker compose --env-file ../.env up -d
```

⚠️ **Kodu dikkatli kullanın!** (Use this code carefully!)

---

## 🎛️ DBeaver Administrative Alignment

Following successful container virtualization, a continuous database channel was provisioned within DBeaver.

![Data Source parameters mapping host fields to isolated environmental limits](https://github.com/nalba/telecom-customer-inventory-analytics-system/assets/section/figure-3-dbeaver)

**Figure 3:** Data Source parameters mapping host fields to isolated environmental limits

---

## 📘 Monorepo Workspace Integration & IDE Synchronization

### 🧩 Architectural Friction

Opening the unified workspace from the topmost root directory caused initialization issues in IntelliJ IDEA:

**Issues Encountered:**
- **Module Exclusion:** The compilation Run/Debug buttons turned gray (inactive) as the IDE did not automatically detect the standalone nested Java application
- **Environment Isolation:** Attempting to run the isolated backend subfolder caused a crash:
  ```
  Driver claims to not accept jdbcUrl because Java lost track of the root .env variables.
  ```

### 🛠️ Permanent Enterprise Resolution Steps

1. **Root Target Expansion**
   - Opened the complete Monorepo bundle (`telecom-customer-inventory-analytics-system`) as the main working catalog

2. **Maven Module Attachment**
   - Right-clicked `backend/pom.xml`
   - Executed "Add as Maven Project"
   - Forced IntelliJ to map the nested dependencies into active runtime contexts

3. **Compiler Standardization**
   - Set the global Java Compiler level strictly to version 25

4. **Working Directory Synchronization**
   - Modified the Spring Boot Run Configuration settings
   - Changed the default execution pathway to target the global root directory

5. **EnvFile Dynamic Binding**
   - Activated the EnvFile plugin tab in the execution profile
   - Established a direct bridge to the root `.env` layout

---

## 🟢 Verification Matrix & State of Completion

![Secure handshakes, dynamic property rendering, and verified storage communications](https://github.com/nalba/telecom-customer-inventory-analytics-system/assets/section/figure-4-verification)

**Figure 4:** Secure handshakes, dynamic property rendering, and verified storage communications

The dynamic integration layer successfully linked the Spring Boot runtime environment with the PostgreSQL engine **without copying `.env` files into sub-modules`.

---

## 🎯 Key Outcomes Achieved

✅ **Zero hardcoded configuration strings** in public code repositories  
✅ **Unified workspace operational bounds** established for Backend and Frontend pipelines  
✅ **Database Communication Verified:**
   - Automatic schema generation verified
   - Structural metadata successfully verified
   - System is fully initialized for Day 2 domain development

---

## 📌 Next Steps

The foundation is now ready for **Day 2: Domain Model Development & API Implementation**
