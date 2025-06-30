#!/bin/zsh
# Script de déploiement blue/green local pour Cesizen
# Usage : ./deploy-bluegreen-local.sh

# 1. Détermine l'env inactif
if [ ! -f /tmp/cesizen_active_env ] || [ "$(cat /tmp/cesizen_active_env)" = "green" ]; then
  NEW_ENV=blue
  OLD_ENV=green
  NEW_PORT=5002
  OLD_PORT=5003
else
  NEW_ENV=green
  OLD_ENV=blue
  NEW_PORT=5003
  OLD_PORT=5002
fi

echo "[INFO] Nouveau déploiement sur $NEW_ENV (port $NEW_PORT), ancien env : $OLD_ENV (port $OLD_PORT)"

# 2. Stoppe et supprime le conteneur cible (nouvel env)
docker stop cesizen_$NEW_ENV 2>/dev/null || true
docker rm cesizen_$NEW_ENV 2>/dev/null || true

# 3. Lance le nouveau conteneur (remplace 'cesizen_app:latest' par le nom de ton image locale si besoin)
docker run -d --name cesizen_$NEW_ENV -p $NEW_PORT:5001 cesizen_app:latest

# 4. Vérifie la santé
sleep 10
if curl --fail http://localhost:$NEW_PORT; then
  echo "[INFO] Nouvelle version OK sur $NEW_ENV ($NEW_PORT)"
else
  echo "[ERREUR] Lancement échoué, logs :"
  docker logs cesizen_$NEW_ENV
  exit 1
fi

# 5. Mise à jour du reverse proxy local (Nginx)
if [ -f /etc/nginx/conf.d/nginx-bluegreen.conf ]; then
  sudo sed -i "s/set \\?backend .*/set $backend localhost:$NEW_PORT;/" /etc/nginx/conf.d/nginx-bluegreen.conf
  sudo nginx -s reload
  echo "[INFO] Reverse proxy Nginx mis à jour sur port $NEW_PORT"
else
  echo "[WARN] Fichier nginx-bluegreen.conf non trouvé dans /etc/nginx/conf.d/ (proxy non mis à jour)"
fi

# 6. Marque l'env actif
echo $NEW_ENV > /tmp/cesizen_active_env

# 7. Stoppe et supprime l'ancien conteneur (ancien env)
docker stop cesizen_$OLD_ENV 2>/dev/null || true
docker rm cesizen_$OLD_ENV 2>/dev/null || true

echo "[INFO] Déploiement blue/green terminé. Env actif : $NEW_ENV (port $NEW_PORT)"
