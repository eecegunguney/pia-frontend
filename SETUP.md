# 📋 Kurulum & Konfigürasyon Rehberi

**Türkçe / English: Setup & Configuration Guide**

---

## 🚀 Hızlı Başlangıç (Quick Start)

### Ön Koşullar (Prerequisites)

- ✅ Java 25+
- ✅ Maven 3.8+
- ✅ Docker & Docker Compose
- ✅ Git
- ✅ IntelliJ IDEA (Önerilir)
- ✅ DBeaver (Veritabanı yönetimi için)

### Adım 1: Projeyi Klonlayın

```bash
git clone <repository-url>
cd telecom-customer-inventory-analytics-system
```

### Adım 2: Ortam Değişkenlerini Yapılandırın

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
# Linux/macOS
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example -Destination .env
```

**`.env` dosyasını düzenleyin ve özel değerlerinizi girin:**

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD_HERE
POSTGRES_DB=inventory_db
```

⚠️ **ÖNEMLİ:** `.env` dosyasını **asla** Git'e commit etmeyin!

### Adım 3: Veritabanı Konteynerini Başlatın

```powershell
# Root dizininden
docker compose --env-file ./.env -f docker/docker-compose.yml up -d
```

Konteyner durumunu kontrol edin:

```powershell
docker ps
```

### Adım 4: IntelliJ IDEA'yı Yapılandırın

1. **Projeyi Aç**
   - `telecom-customer-inventory-analytics-system` kök dizinini açın

2. **Maven Projesini Ekle**
   - `backend/pom.xml` → sağ tıkla → "Add as Maven Project"

3. **Java Compiler Seviyesini Ayarla**
   - File → Project Structure → Project
   - SDK: Java 25
   - Language level: 25

4. **Run Configuration Oluştur**
   - Run → Edit Configurations
   - New → Spring Boot
   - Name: `TelecomSystem`
   - Main class: `com.pia.inventory.TelecomCustomerInventoryAnalyticsSystemApplication`
   - Working directory: **Root directory** (Proje kökü)
   - Environment variables: `.env` dosyasını ekle (EnvFile plugin)

5. **EnvFile Plugin Kur** (eğer yoksa)
   - Settings → Plugins → EnvFile
   - Install & Restart

### Adım 5: Veritabanı Bağlantısını Doğrula

**DBeaver'da:**

1. Database → New Database Connection
2. PostgreSQL seçin
3. Bağlantı detaylarını girin:
   - **Server Host:** localhost
   - **Port:** 5432
   - **Database:** inventory_db
   - **Username:** (`.env`'den)
   - **Password:** (`.env`'den)
4. Test Connection → Finish

✅ Bağlantı başarılıysa devam edebilirsiniz!

---

## 🐳 Docker Komutları

### Konteyner Yönetimi

```powershell
# Konteynerleri Başlat
docker compose --env-file ./.env -f docker/docker-compose.yml up -d

# Konteynerleri Durdur
docker compose -f docker/docker-compose.yml down

# Logları Görüntüle
docker compose -f docker/docker-compose.yml logs -f postgres

# Konteyner İçine Gir
docker exec -it telecom-inventory-postgres psql -U admin -d inventory_db
```

### PostgreSQL Komutları (Konteyner içinde)

```sql
-- Veritabanlarını Listele
\l

-- Inventory_db'ye Bağlan
\c inventory_db

-- Tabloları Listele
\dt

-- Şemayı Görüntüle
\d table_name
```

---

## 🔧 IntelliJ IDEA Sorunları & Çözümler

### Problem: "Run" Butonu Grayed Out

**Çözüm:**
1. Root dizininden projeyi açın (sadece `/backend` değil!)
2. File → Project Structure → Modules
3. `backend` modülünü kontrol edin
4. Maven reimport yapın (pom.xml → sağ tıkla → Reload)

### Problem: "Driver claims to not accept jdbcUrl"

**Çözüm:**
1. `.env` dosyasının kök dizinde olduğunu doğrula
2. Run Configuration → Environment variables → `.env` dosyasını seç
3. Working directory'yi root olarak ayarla

### Problem: PostgreSQL Konteyner Başlamıyor

**Çözüm:**
```powershell
# .env dosyasının var olduğunu kontrol et
Test-Path .env

# Eski konteynerleri temizle
docker compose -f docker/docker-compose.yml down -v

# Yeniden başlat
docker compose --env-file ./.env -f docker/docker-compose.yml up -d
```

---

## 📊 Uygulamayı Çalıştır

### IDE'den

1. IntelliJ IDEA'da oluşturduğun Run Configuration'ı seç
2. Green "Run" butonuna tıkla
3. Console'da "Started TelecomCustomerInventoryAnalyticsSystemApplication" mesajını bekle

### Komut Satırından

```bash
# Maven ile
mvn spring-boot:run

# Build edip JAR dosyasını çalıştır
mvn clean package
java -jar target/telecom-customer-inventory-analytics-system-0.0.1-SNAPSHOT.jar
```

### Uygulamayı Kontrol Et

```bash
# Sağlık kontrolü
curl http://localhost:8080/actuator/health
```

---

## 🔐 Güvenlik Kontrol Listesi

- [ ] `.env` dosyasını `.gitignore`'a eklediniz mi?
- [ ] `.env` dosyasında strong password kullandınız mı?
- [ ] `.env` dosyasını hiç commit etmediniz mi?
- [ ] `.env.example` dosyasını takım referansı olarak oluşturdunuz mu?

---

## 📞 Sorun Giderme

### Loglarda Hata Görüyorsanız

1. **PostgreSQL Bağlantısı Hatasıdır:**
   ```powershell
   docker compose -f docker/docker-compose.yml logs postgres
   ```

2. **Ortam Değişkeni Hatasıdır:**
   - `.env` dosyasını kontrol et
   - IntelliJ Configuration'da envFile plugin'ini etkinleştir

3. **Port Çakışması:**
   ```powershell
   netstat -ano | findstr :5432  # Windows
   lsof -i :5432                 # Linux/macOS
   ```

---

## ✅ Başarılı Kurulum İşaretleri

✓ Docker konteynerler çalışıyor (`docker ps` ile görüntüle)  
✓ IntelliJ IDEA'da Run button etkin  
✓ DBeaver'da veritabanı bağlantısı başarılı  
✓ Uygulama başlıyor (console'da "Started..." mesajı)  
✓ `http://localhost:8080/actuator/health` cevap döner  

---

## 📚 Sonraki Adımlar

- [Backend README'i Oku](../backend/README.md)
- [Docker Compose Dokumentasyonu](../docker/docker-compose.yml)
- Veri modelini tasarlamaya başla

---

**Sorularınız mı var? İssue oluşturun veya belgeleri kontrol edin!**

