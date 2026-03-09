#!/bin/bash
# Coollooks23 Booking System - Setup Script

set -e

echo "🚀 Coollooks23 Booking System Setup"
echo "===================================="

# 1. Install PocketBase
echo "[1/5] Installing PocketBase..."
cd /opt
if [ ! -f pocketbase ]; then
    curl -L -o pocketbase.zip https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
    unzip -o pocketbase.zip
    rm pocketbase.zip
fi
chmod +x pocketbase

# 2. Create admin
echo "[2/5] Creating admin account..."
./pocketbase admin create admin@coollooks.com.au coollooks2024 || true

# 3. Start PocketBase in background
echo "[3/5] Starting PocketBase..."
nohup ./pocketbase serve --http=0.0.0.0:8090 > /var/log/pocketbase.log 2>&1 &
sleep 3

# 4. Create collections (using API)
echo "[4/5] Creating collections..."

# Create users collection
curl -X POST http://localhost:8090/api/collections \
  -H "Content-Type: application/json" \
  -H "Authorization: ADMIN_TOKEN_HERE" \
  -d '{
    "name": "users",
    "type": "auth",
    "system": false,
    "schema": [
      {"system": false, "id": "phone", "name": "phone", "type": "text", "required": false},
      {"system": false, "id": "stripe_customer_id", "name": "stripe_customer_id", "type": "text", "required": false},
      {"system": false, "id": "subscription_active", "name": "subscription_active", "type": "bool", "required": false}
    ]
  }'

# Create services collection
curl -X POST http://localhost:8090/api/collections \
  -H "Content-Type: application/json" \
  -H "Authorization: ADMIN_TOKEN_HERE" \
  -d '{
    "name": "services",
    "type": "base",
    "schema": [
      {"system": false, "id": "duration", "name": "duration", "type": "number", "required": true},
      {"system": false, "id": "price", "name": "price", "type": "number", "required": true},
      {"system": false, "id": "category", "name": "category", "type": "text", "required": false}
    ]
  }'

# Create bookings collection
curl -X POST http://localhost:8090/api/collections \
  -H "Content-Type: application/json" \
  -H "Authorization: ADMIN_TOKEN_HERE" \
  -d '{
    "name": "bookings",
    "type": "base",
    "schema": [
      {"system": false, "id": "user", "name": "user", "type": "relation", "required": true, "collectionId": "users"},
      {"system": false, "id": "service", "name": "service", "type": "relation", "required": true, "collectionId": "services"},
      {"system": false, "id": "date_time", "name": "date_time", "type": "date", "required": true},
      {"system": false, "id": "status", "name": "status", "type": "select", "required": true, "options": ["pending","confirmed","cancelled","completed"]}
    ]
  }'

echo "[5/5] Setup complete!"
echo "====================="
echo "PocketBase Admin: http://your-server:8090/_/"
echo "API Endpoint: http://your-server:8090/api/"
echo ""
echo "Next: Set up n8n with the workflow"
