#!/bin/bash

echo "🚀 Test du déploiement local"
echo "=============================="

# Arrêter les conteneurs existants
echo "Arrêt des conteneurs existants..."
docker-compose down --remove-orphans || true

# Construire et démarrer les conteneurs
echo "Construction et démarrage des conteneurs..."
docker-compose up -d --build

# Attendre que les services soient prêts
echo "Attente du démarrage des services..."
sleep 20

# Vérifier que les conteneurs sont en cours d'exécution
echo "Vérification des conteneurs en cours d'exécution..."
docker-compose ps

# Test de l'API
echo "Test de l'API..."
if curl -f http://localhost:5001/api; then
    echo "✅ API accessible"
else
    echo "❌ API non accessible"
    docker-compose logs app
    exit 1
fi

# Test du front-end
echo "Test du front-end..."
if curl -f -L http://localhost:5001 | grep -q "<!DOCTYPE html"; then
    echo "✅ Front-end accessible"
else
    echo "❌ Front-end non accessible"
    docker-compose logs app
    exit 1
fi

echo ""
echo "🎉 Déploiement réussi !"
echo "Application accessible sur : http://localhost:5001"
echo "API accessible sur : http://localhost:5001/api"
