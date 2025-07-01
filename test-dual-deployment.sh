#!/bin/bash

# Script de test pour les déploiements WEB et MOBILE en local
set -e

echo "🚀 Testing Web & Mobile deployments locally"

# Nettoyage initial
echo "🧹 Cleaning up existing containers..."
docker-compose down --remove-orphans || true
docker system prune -f || true

# Test 1: Déploiement WEB
echo ""
echo "==============================================="
echo "🌐 TESTING WEB DEPLOYMENT"
echo "==============================================="

echo "Building and starting WEB version..."
docker-compose build app-web
docker-compose up -d db app-web

echo "Waiting for services to start..."
sleep 30

echo "Testing WEB version..."
WEB_SUCCESS=true

# Test API Web
if curl --fail --silent http://localhost:5001/api > /dev/null; then
    echo "✅ Web API accessible"
else
    echo "❌ Web API failed"
    WEB_SUCCESS=false
fi

# Test Frontend Web
if curl --fail --silent -L http://localhost:5001 | grep -q "<!DOCTYPE html"; then
    echo "✅ Web frontend accessible"
else
    echo "❌ Web frontend failed"
    WEB_SUCCESS=false
fi

if [ "$WEB_SUCCESS" = true ]; then
    echo "🎉 WEB deployment successful"
else
    echo "💥 WEB deployment failed"
    echo "Web logs:"
    docker-compose logs app-web
fi

# Test 2: Déploiement MOBILE
echo ""
echo "==============================================="
echo "📱 TESTING MOBILE DEPLOYMENT"
echo "==============================================="

echo "Building and starting MOBILE version..."
docker-compose build app-mobile
docker-compose up -d db app-mobile

echo "Waiting for mobile service to start..."
sleep 30

echo "Testing MOBILE version..."
MOBILE_SUCCESS=true

# Test API Mobile
if curl --fail --silent http://localhost:5002/ > /dev/null; then
    echo "✅ Mobile API accessible"
else
    echo "❌ Mobile API failed"
    MOBILE_SUCCESS=false
fi

# Test Mobile Assets
if curl --fail --silent http://localhost:5002/mobile > /dev/null; then
    echo "✅ Mobile assets accessible"
else
    echo "⚠️  Mobile assets endpoint not accessible (may be normal)"
fi

if [ "$MOBILE_SUCCESS" = true ]; then
    echo "🎉 MOBILE deployment successful"
else
    echo "💥 MOBILE deployment failed"
    echo "Mobile logs:"
    docker-compose logs app-mobile
fi

# Résumé final
echo ""
echo "==============================================="
echo "📋 DEPLOYMENT SUMMARY"
echo "==============================================="

echo "Web deployment: $([ "$WEB_SUCCESS" = true ] && echo "✅ SUCCESS" || echo "❌ FAILED")"
echo "Mobile deployment: $([ "$MOBILE_SUCCESS" = true ] && echo "✅ SUCCESS" || echo "❌ FAILED")"

echo ""
echo "📊 Container status:"
docker-compose ps

echo ""
echo "🌍 Services accessible at:"
echo "  - Web: http://localhost:5001"
echo "  - Mobile API: http://localhost:5002"

# Test des deux services en parallèle si tout est OK
if [ "$WEB_SUCCESS" = true ] && [ "$MOBILE_SUCCESS" = true ]; then
    echo ""
    echo "🔄 Testing both services running simultaneously..."
    
    # Démarrer les deux services
    docker-compose up -d db app-web app-mobile
    sleep 20
    
    # Tests simultanés
    WEB_PARALLEL=$(curl --fail --silent http://localhost:5001/api && echo "✅" || echo "❌")
    MOBILE_PARALLEL=$(curl --fail --silent http://localhost:5002/ && echo "✅" || echo "❌")
    
    echo "Parallel test results:"
    echo "  - Web: $WEB_PARALLEL"
    echo "  - Mobile: $MOBILE_PARALLEL"
fi

echo ""
echo "🏁 Test completed!"
