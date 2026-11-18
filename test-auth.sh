#!/bin/bash
# Requires a running server (npm run start) and a database reachable via DATABASE_URL.
# Each run uses a unique email so it can be repeated against the same database.

BASE=${BASE:-http://localhost:3000}
EMAIL="test-$(date +%s)@example.com"
PASSWORD="password123"

echo "=== Testing VetApp Authentication ==="
echo "Using email: $EMAIL"
echo ""

echo "Test 1: Signup (PET_OWNER)"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"role\":\"PET_OWNER\"}"
echo ""

echo "Test 2: Login (expect 200)"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
echo ""

echo "Test 3: Login with wrong password (expect 401)"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"wrongpassword\"}"
echo ""

echo "Test 4: Signup with the same email (expect 409)"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Other\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"role\":\"VETERINARIAN\"}"
echo ""

echo "Test 5: Signup with short password (expect 400)"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Short\",\"email\":\"short-$EMAIL\",\"password\":\"123\",\"role\":\"PET_OWNER\"}"
echo ""

echo "Test 6: Dashboard without cookie (expect redirect to /login)"
curl -s -o /dev/null -w "HTTP %{http_code} -> %{redirect_url}\n" "$BASE/dashboard/owner"
echo ""

echo "=== Tests completed ==="
