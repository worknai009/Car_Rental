# 🚗 CarHub – Car Rental Management System

A full-stack car rental platform built with **Node.js/Express** backend and **React (Vite)** frontend. Features three independent panels — **User**, **Admin**, and **Car Register Owner** — with booking management, invoice generation, event requests, and detailed analytics.

---

## 📸 Features

### 👤 User Panel
- **Authentication** – Register, Login (OTP-based), Forgot/Reset Password
- **Browse Cars** – Filter by category, brand, city, fuel type, seats, price, badge
- **Book Cars** – Two modes: **Rental** (multi-day) & **Transfer** (one-way), billing per day or per KM
- **Google Maps Integration** – Pickup/drop location with autocomplete & distance calculation
- **My Bookings** – View bookings, cancel requests, download invoice PDFs
- **Feedback** – Rate and review completed bookings
- **Event Requests** – Request cars for events (weddings, corporate, etc.)
- **Contact Form** – Submit inquiries to admin

### 🛡️ Admin Panel
- **Dashboard** – Monthly revenue (completed rides), new bookings, total users, cars, car register users
- **Bookings Management** – View all bookings, update status (Booked → Approved → Confirmed → Paid → Completed / Cancelled)
- **Car Management** – Add/Edit/Delete cars with image upload, categories, badges (Silver/Gold/Platinum)
- **Cancel Requests** – Review and approve/reject user cancellation requests
- **Car Register Requests** – Approve/reject car submissions from car owners
- **Analytics Charts** – Bar, Pie, Line, Geography charts (Nivo)
- **Calendar** – FullCalendar integration
- **User Management** – View all users
- **Contact List** – View submitted contact messages
- **Feedback List** – View user reviews
- **Event Requests** – Manage event car requests
- **Invoice** – Print/download booking invoices

### 🚘 Car Register Panel (Car Owners)
- **Register/Login** – Separate authentication for car owners
- **Submit Car** – Upload car details, images, RC book, insurance, PUC, ID proof for admin approval
- **My Cars** – View approved/pending/rejected car submissions
- **Edit/Delete Cars** – Update car info (syncs to main cars table)
- **Bookings** – View bookings on their cars
- **Dashboard** – Revenue stats, total cars, booking count
- **Profile** – Manage profile info

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Express.js** | REST API framework |
| **MySQL** | Database |
| **JWT** | Authentication & authorization |
| **bcryptjs** | Password hashing |
| **Nodemailer** | OTP & password reset emails (SMTP) |
| **PDFKit** | Invoice PDF generation |
| **express-fileupload** | Car image & document uploads |
| **express-validator** | Request validation |
| **dotenv** | Environment configuration |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **Material UI (MUI)** | Admin panel UI components |
| **TailwindCSS 4** | User-facing styling |
| **Lucide React** | Icons |
| **Nivo** | Charts (Bar, Pie, Line, Geo) |
| **FullCalendar** | Calendar component |
| **Google Maps API** | Location autocomplete & maps |
| **Formik + Yup** | Form handling & validation |
| **ScrollReveal** | Scroll animations |
| **react-pro-sidebar** | Admin sidebar navigation |

---

## 📁 Project Structure

```
Car_Rental_Node/
├── backend/
│   ├── server.js                    # Entry point
│   ├── .env                         # Environment variables
│   ├── public/                      # Uploaded files & static assets
│   │   ├── fonts/                   # PDF fonts (DejaVuSans for ₹ symbol)
│   │   └── uploads/cars/            # Car images & documents
│   └── src/
│       ├── config/db.js             # MySQL connection
│       ├── controllers/
│       │   ├── admin/               # Admin controllers (dashboard, bookings, cars, etc.)
│       │   ├── user/                # User controllers (auth, booking, cars, feedback, etc.)
│       │   └── car-register/        # Car register owner controllers
│       ├── middleware/validate.js    # Express-validator middleware
│       ├── routes/
│       │   ├── admin/               # Admin routes
│       │   ├── user/                # User routes
│       │   └── car-register/        # Car register routes
│       ├── services/                # Business logic (booking, feedback, events)
│       ├── utils/
│       │   ├── jwt.js               # JWT sign/verify/middleware
│       │   └── email.js             # OTP email sender
│       └── validations/             # Request validation schemas
│
├── frontend/
│   ├── .env                         # VITE_API_URL, VITE_GOOGLE_MAPS_KEY
│   ├── public/                      # Static assets
│   └── src/
│       ├── App.jsx                  # Root routing
│       ├── components/              # Shared components (Layout, AdminLayout, etc.)
│       ├── pages/
│       │   ├── admin/               # Admin panel pages
│       │   ├── carRegister/         # Car register panel pages
│       │   ├── CarsPage.jsx         # Browse cars
│       │   ├── CarDetails.jsx       # Car detail page
│       │   ├── ReviewBooking.jsx    # Booking review & confirm
│       │   ├── MyBookings.jsx       # User bookings list
│       │   ├── EventsPage.jsx       # Event request form
│       │   └── ...                  # Login, Register, Contact, About, etc.
│       ├── utils/
│       │   ├── userApi.js           # Axios instance (user token)
│       │   └── adminApi.js          # Axios instance (admin token)
│       └── theme/                   # MUI theme config
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** >= 18.x
- **MySQL** >= 8.0
- **npm** >= 9.x

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Car_Rental_Node.git
cd Car_Rental_Node
```

### 2. Setup Database
Create a MySQL database:
```sql
CREATE DATABASE car_rental_system_node;
```
Import the SQL schema (if you have a dump file), or let the app create tables.

### 3. Backend Setup
```bash
cd backend
npm install
```

# JWT
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=1d

# SMTP (for OTP & password reset emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS
CLIENT_URL=http://localhost:5173,http://localhost:5174
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npx nodemon server.js
```
Server runs on **http://localhost:1000**

### 4. Frontend Setup
```bash
cd frontend
npm install
```



Start the frontend:
```bash
npm run dev
```
App runs on **http://localhost:5173**

---

## 🗄️ Database Tables

| Table | Description |
|---|---|
| `users` | Registered users (name, email, phone, password, OTP) |
| `admins` | Admin accounts |
| `cars` | Listed cars (name, brand, price, image, category, badge, etc.) |
| `categories` | Car categories |
| `bookings` | Booking records (user, car, dates, amount, status) |
| `cancel_requests` | User cancellation requests (pending/approved/rejected) |
| `feedback` | User reviews & ratings per booking |
| `contact` | Contact form submissions |
| `car_register_users` | Car owner accounts |
| `car_registration_requests` | Car submission requests from owners |
| `event_requests` | Event car requests |

---

## 🔑 API Routes

### User Routes (`/api/`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login (sends OTP) |
| POST | `/auth/verify-otp` | Verify OTP & get token |
| POST | `/auth/forgot-password` | Send reset link |
| POST | `/auth/reset-password` | Reset password |
| GET | `/cars` | List all cars |
| GET | `/cars/:id` | Car details |
| GET | `/cars/filter` | Filter cars |
| GET | `/cars/suggest` | Car suggestions |
| POST | `/bookings/booking` | Create booking |
| GET | `/bookings/mybookings` | My bookings |
| PUT | `/bookings/cancel/:id` | Cancel booking |
| GET | `/bookings/invoice/:id` | Download invoice PDF |
| POST | `/bookings/cancel-request/:id` | Request cancellation |
| POST | `/feedback` | Submit feedback |
| POST | `/contact` | Submit contact message |
| POST | `/event-requests` | Create event request |

### Admin Routes (`/api/admin/`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Admin login |
| GET | `/dashboard` | Dashboard stats |
| GET | `/bookings` | All bookings |
| PATCH | `/bookings/:id/status` | Update booking status |
| GET | `/cancel-requests` | List cancel requests |
| POST | `/cancel-requests/:id/approve` | Approve cancellation |
| POST | `/cancel-requests/:id/reject` | Reject cancellation |
| POST | `/cars` | Add car |
| PUT | `/cars/:id` | Update car |
| DELETE | `/cars/:id` | Delete car (soft) |
| GET | `/car-requests` | Car registration requests |
| POST | `/car-requests/:id/approve` | Approve car request |
| POST | `/car-requests/:id/reject` | Reject car request |

### Car Register Routes (`/api/car-register/`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register car owner |
| POST | `/auth/login` | Login car owner |
| POST | `/cars/add` | Submit car for approval |
| GET | `/cars/my` | My approved cars |
| GET | `/cars/my/all` | All my car requests |
| PUT | `/cars/:id` | Edit car |
| DELETE | `/cars/:id` | Delete car |
| GET | `/bookings/my` | Bookings on my cars |
| GET | `/dashboard` | Dashboard stats |

---

## 🔐 Authentication Flow

1. **User Register** → saves to `users` table
2. **Login** → validates credentials → sends **OTP** to email
3. **Verify OTP** → returns **JWT token** (stored in `localStorage`)
4. **Protected routes** → token sent in `Authorization: Bearer <token>` header
5. **Auto-logout** → 401 response intercepted by Axios → clears token → redirects to login

---

## 📄 License

This project is for educational/portfolio purposes.

---

## 👨‍💻 Author

**Ruturaj Vidhate**
