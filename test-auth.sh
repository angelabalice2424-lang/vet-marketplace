#!/bin/bash

echo "=== Testing VetApp Authentication ==="
echo ""

# Test 1: Signup
echo "Test 1: Creando usuario nuevo..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "role": "PET_OWNER"
  }')

echo "Response: $SIGNUP_RESPONSE"
echo ""

# Test 2: Login
echo "Test 2: Intentando login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Test 3: Login with wrong password
echo "Test 3: Login con contraseña incorrecta..."
WRONG_PASSWORD=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "wrongpassword"
  }')

echo "Response: $WRONG_PASSWORD"
echo ""

# Test 4: Signup duplicate email
echo "Test 4: Intentando crear usuario con email duplicado..."
DUPLICATE=$(curl -s -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Otro Usuario",
    "email": "juan@example.com",
    "password": "password123",
    "role": "VETERINARIAN"
  }')

echo "Response: $DUPLICATE"
echo ""

echo "=== Tests Completados ==="
