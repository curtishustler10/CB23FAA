# PocketBase Schema - Coollooks23 Booking System

## Collections to Create

### 1. users
```
email (text, required, unique)
name (text)
phone (text)
stripe_customer_id (text)
subscription_active (bool)
subscription_id (text)
created (date)
updated (date)
```

### 2. services
```
name (text, required)
duration (number, required)  -- minutes
price (number, required)
category (text)
description (text)
active (bool)
```

### 3. bookings
```
user (relation -> users)
service (relation -> services)
date_time (date, required)
status (select: pending,confirmed,cancelled,completed)
notes (text)
created (date)
updated (date)
```

### 4. subscriptions
```
user (relation -> users)
stripe_subscription_id (text)
status (select: active,paused,cancelled)
current_period_end (date)
created (date)
```

---

## API Endpoints (Built-in)

```
# Users
POST /api/collections/users/records
GET  /api/collections/users/records/:id
PATCH /api/collections/users/records/:id
DELETE /api/collections/users/records/:id

# Services
GET  /api/collections/services/records

# Bookings
POST /api/collections/bookings/records
GET  /api/collections/bookings/records?filter=date_time>='2026-03-09'

# Subscriptions
POST /api/collections/subscriptions/records
```

---

## PocketBase Admin

```
URL: http://your-server:8090/admin/
```

---

## Install PocketBase

```bash
# Download
curl -L -o pocketbase https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
unzip pocketbase_0.22.0_linux_amd64.zip

# Run
./pocketbase serve

# Default admin
email: admin@pocketbase.io
password: your-password
```

---

## Migration from Supabase

All the same functionality - just swap the API endpoint.

**Supabase:** `https://xxxx.supabase.co`
**PocketBase:** `http://your-server:8090`
