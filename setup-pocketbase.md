# Phase 2: Setup - PocketBase

## 1. Install PocketBase (on your server)

```bash
# SSH to your server, then:
cd /opt
curl -L -o pocketbase.zip https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
unzip pocketbase.zip

# Create admin
./pocketbase admin create admin@coollooks.com.au yourpassword

# Start
./pocketbase serve --http=0.0.0.0:8090
```

## 2. Create Collections

1. Go to: `http://your-server:8090/_/`
2. Login with admin credentials
3. Create each collection (see pocketbase-schema.md)

## 3. Configure

**Your PocketBase URL:** `http://your-server:8090`

---

## Updated Tech Stack (All Free!)

| Component | Cost |
|----------|------|
| PocketBase | $0 |
| n8n | $0 |
| Stripe | 2.9% + 30¢ per tx |

**Total cost:** Just Stripe fees
