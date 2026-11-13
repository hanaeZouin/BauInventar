# BauInventar – Baustellen-Inventarverwaltung

## Projektbeschreibung

BauInventar ist eine Full-Stack-Webanwendung zur Verwaltung von Geräten und Materialien auf Baustellen.

Die Anwendung ermöglicht es, Ausrüstungsgegenstände und Kategorien zentral zu verwalten, Bestände zu überwachen und den aktuellen Status der Geräte einzusehen.

## Funktionen

- Dashboard mit wichtigen Kennzahlen
- Geräte hinzufügen, bearbeiten und löschen
- Kategorien hinzufügen, bearbeiten und löschen
- Geräte nach Name oder Referenz suchen
- Geräte nach Status filtern
- Verwaltung von Menge, Standort und Beschreibung
- Responsive Benutzeroberfläche für Desktop und Mobilgeräte

## Technologien

**Frontend**
- React.js
- JavaScript
- CSS

**Backend**
- PHP
- Laravel 12
- REST API

**Datenbank**
- MySQL

## Installation und Ausführung

### Voraussetzungen

- PHP
- Composer
- Node.js und npm
- MySQL

### 1. Repository klonen

```bash
git clone https://github.com/hanaeZouin/BauInventar.git
cd BauInventar
```

### 2. Datenbank erstellen

Eine MySQL-Datenbank mit dem Namen `bauinventar` erstellen.

### 3. Backend einrichten

```bash
cd backend
composer install
```

Die Datei `.env.example` kopieren und als `.env` speichern.

Unter Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Die Datenbankverbindung in `.env` konfigurieren:

```env
DB_DATABASE=bauinventar
DB_USERNAME=root
DB_PASSWORD=
```

Anschließend:

```bash
php artisan key:generate
php artisan migrate
php artisan serve
```

Das Backend ist anschließend unter http://127.0.0.1:8000 erreichbar.

### 4. Frontend starten

Ein neues Terminal öffnen:

```bash
cd frontend
npm install
npm run dev
```

Das Frontend ist anschließend unter http://localhost:5173 erreichbar.

## Projektziel

Ziel dieses Projekts ist es, praktische Kenntnisse in der Full-Stack-Webentwicklung, insbesondere mit React, Laravel, REST APIs und MySQL, anzuwenden und weiterzuentwickeln.

## Projektstatus

Die grundlegenden Funktionen zur Geräte- und Kategorienverwaltung sind implementiert. Weitere Tests und Verbesserungen sind geplant.