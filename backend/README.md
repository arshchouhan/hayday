# YourLivestock

A centralized digital platform for unique identification, real-time tracking of livestock ownership, health, and movement, improving transparency, disease control, and farmer support across India.

## Project Links

- License: MIT
- Laravel: 13.x
- React: 18.x
- MySQL: 8.0
- Status: In Development

---

## Table of Contents

- [About The Project](#about-the-project)
- [The Problem](#the-problem)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## About The Project

YourLivestock is a government-aligned digital livestock management system inspired by India's National Digital Livestock Mission (NDLM). It provides every animal with a unique 12-digit UID, like Aadhaar for animals, enabling farmers, veterinarians, and government officials to manage livestock data from a single platform.

<div align="center">

| 535M+ | 12-Digit UID | 28 States | Real-time Health |
|:---:|:---:|:---:|:---:|
| Animals in India | Unique per animal | Coverage goal | Alerts and tracking |

</div>

---

## The Problem

India has over 535 million livestock animals but no unified digital system to manage them. This causes:

- Disease outbreaks spread unchecked, including FMD, Brucellosis, and Lumpy Skin Disease
- Subsidy fraud when the same animal is claimed multiple times across schemes
- No health history when buying or selling animals at mandis
- Livestock theft with no ownership proof system
- Delayed government response during disease alerts due to no real-time data
- No movement control at inter-district or inter-state checkposts

---

## Key Features

### Unique Animal Identification
- Auto-generated 12-digit UID per animal, for example HP-COW-00423
- QR code and RFID ear tag integration
- Species, breed, age, sex, color, and photo storage

### Farmer Dashboard
- Register and manage all owned animals
- View upcoming vaccination schedules
- Check subsidy eligibility
- Receive SMS and app disease alerts

### Health Record Management
- Full vaccination history with dates and vaccine names
- Vet visit logs with diagnosis notes
- Disease status tracking per animal
- Insurance claim trail

### Movement Tracking
- Log animal movement between districts and states
- Digital movement permits that replace paper forms
- Entry and exit logs at mandis and checkposts
- GPS trail support for IoT-ready tracking

### Government Admin Panel
- Disease outbreak heatmaps by district
- Regional livestock census data
- Approve or reject movement permits
- Push disease alerts to farmers by region

### Security and Auth
- Aadhaar OTP-based farmer registration
- JWT and Laravel Sanctum for API security
- Role-based access for farmer, vet, and admin

---

## System Architecture

```text
React Frontend
Landing Page + Farmer Dashboard + Admin
						|
						| HTTPS using Axios and JWT
						v
Laravel REST API
Auth | Animals | Health | Movement | Alerts
						|
	 -------------------------
	 |           |           |
	 v           v           v
 MySQL       Redis      Storage
main data  sessions/cache  animal photos
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Laravel 13 | REST API framework |
| Laravel Sanctum | Token-based authentication |
| MySQL 8.0 | Primary relational database |
| Redis | Session caching and queue jobs |
| Intervention Image | Animal photo upload and resize |
| Spatie Permissions | Role management |
| Twilio | SMS alerts to farmers |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM | Client-side routing |
| Axios | API communication |
| Tailwind CSS | Styling |
| Recharts | Dashboard charts and graphs |
| React Toastify | Notifications |
| React Query | Server state management |

### DevOps and Tools
| Technology | Purpose |
|---|---|
| AWS EC2 | Backend hosting |
| Vercel | Frontend deployment |
| MongoDB Atlas | Optional movement logs |
| Docker | Local development environment |
| GitHub Actions | CI/CD pipeline |

---

## Database Schema

```sql
-- Farmers / Users
users
	id, name, aadhaar_number, phone, email, village,
	district, state, role (farmer/vet/admin), created_at

-- Animals
animals
	id, uid (12-digit), species, breed, age, sex, color,
	photo_url, owner_id (FK -> users), birth_date, created_at

-- Health Records
health_records
	id, animal_id (FK), date, diagnosis, treatment,
	vaccine_name, vet_name, next_due_date, created_at

-- Movement Logs
movements
	id, animal_id (FK), from_location, to_location,
	purpose, permit_number, status, moved_at

-- Disease Alerts
alerts
	id, title, type, affected_district, animal_species,
	message, severity (low/medium/high), created_by, created_at

-- Ownership Transfers
transfers
	id, animal_id (FK), from_owner (FK), to_owner (FK),
	transfer_date, reason, verified_by
```

---

## API Endpoints

### Auth
```text
POST   /api/auth/register          Register farmer with Aadhaar
POST   /api/auth/login             Login and get JWT token
POST   /api/auth/logout            Revoke token
```

### Animals
```text
GET    /api/animals                List all animals of logged-in farmer
POST   /api/animals                Register a new animal
GET    /api/animals/{uid}          Get single animal by UID
PUT    /api/animals/{uid}          Update animal details
DELETE /api/animals/{uid}          Remove animal record
```

### Health Records
```text
GET    /api/health/{animal_id}     Get all health records for an animal
POST   /api/health                 Add new health record or vaccine log
GET    /api/health/upcoming        Get animals with upcoming vaccines
```

### Movement
```text
POST   /api/movement               Log animal movement
GET    /api/movement/{animal_id}   Get movement history
PUT    /api/movement/{id}/approve  Admin approves movement permit
```

### Dashboard and Alerts
```text
GET    /api/dashboard/stats        Summary counts for farmer dashboard
GET    /api/alerts                 Get active alerts for farmer's district
POST   /api/alerts                 Admin creates new disease alert
```

---

## Project Structure

```text
yourlivestock/
|
|-- app/
|   |-- Http/Controllers/
|   |-- Models/
|   `-- Providers/
|-- bootstrap/
|-- config/
|-- database/
|   |-- factories/
|   |-- migrations/
|   `-- seeders/
|-- public/
|-- resources/
|   |-- css/
|   |-- js/
|   `-- views/
|-- routes/
|-- storage/
|-- tests/
|-- composer.json
|-- package.json
`-- README.md
```

---

## Getting Started

### Prerequisites

```bash
PHP >= 8.3
Composer
Node.js >= 18.x
MySQL 8.0
Redis (optional)
```

### Backend Setup

```bash
git clone https://github.com/yourusername/yourlivestock.git
cd yourlivestock

composer install

cp .env.example .env
php artisan key:generate

php artisan migrate --seed

php artisan serve
```

### Frontend Setup

```bash
npm install
npm run dev
```

### Docker

```bash
docker-compose up --build
```

---

## Screenshots

| Landing Page | Farmer Dashboard |
|---|---|
| Hero section with registration CTA | Stats, animal list, alerts |

| Animal Profile | Health Records |
|---|---|
| Full UID card with QR code | Vaccination timeline |

---

## Roadmap

- Project planning and architecture
- Database schema design
- Laravel API auth module
- Laravel API animal CRUD
- Laravel API health records
- Laravel API movement permits
- React landing page
- React farmer dashboard
- React animal registration form
- QR code generation per animal
- SMS alert system via Twilio
- Government admin panel
- Disease heatmap using Google Maps API
- Mobile app using React Native
- RFID and IoT integration

---

## Contributing

Contributions are welcome. Please follow these steps:

```bash
1. Fork the project
2. Create your feature branch: git checkout -b feature/AmazingFeature
3. Commit your changes: git commit -m 'Add AmazingFeature'
4. Push to the branch: git push origin feature/AmazingFeature
5. Open a Pull Request
```

---

## License

Distributed under the MIT License. See LICENSE for more information.

---

<div align="center">

Made with love for Indian farmers

Inspired by India's National Digital Livestock Mission (NDLM) and the Department of Animal Husbandry and Dairying, Government of India

Star this repo if you find it useful.

</div>
