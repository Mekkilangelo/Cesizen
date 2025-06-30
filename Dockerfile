# Dockerfile pour backend Node.js (server/)
# Étape 1 : Builder le front web
FROM node:20-alpine AS frontend-build
WORKDIR /front
COPY mobile/package*.json ./
RUN npm ci
COPY mobile/ .
RUN npm run build

# Étape 2 : Builder le backend Node.js
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .

# Copier le build du front dans le backend (public/)
COPY --from=frontend-build /front/web-build ./public

# Exposer le port utilisé par l'app Node.js
EXPOSE 5001

# Commande de démarrage
CMD ["node", "server.js"]
