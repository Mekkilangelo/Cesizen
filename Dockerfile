# Multi-stage Dockerfile pour backend + frontend web et mobile

# ==========================================
# Étape 1 : Base pour les builds frontend
# ==========================================
FROM node:20-alpine AS frontend-base
WORKDIR /frontend
RUN npm install -g @expo/cli eas-cli
COPY mobile/package*.json ./
RUN npm ci
COPY mobile/ .

# ==========================================
# Étape 2 : Build frontend WEB
# ==========================================
FROM frontend-base AS frontend-web-build
RUN npx expo export --platform web --output-dir web-build
RUN echo "Web build completed" && ls -la web-build/

# ==========================================
# Étape 3 : Build frontend MOBILE (Expo)
# ==========================================
FROM frontend-base AS frontend-mobile-build
RUN npx expo export --platform ios --platform android --output-dir mobile-build
RUN echo "Mobile build completed" && ls -la mobile-build/

# ==========================================
# Étape 4 : Base backend Node.js
# ==========================================
FROM node:20-alpine AS backend-base
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .

# ==========================================
# Étape 5 : Backend + Frontend WEB
# ==========================================
FROM backend-base AS backend-web
# Copier le build web dans le dossier public du backend
COPY --from=frontend-web-build /frontend/web-build ./public
RUN echo "Web files copied to backend:" && ls -la ./public/
EXPOSE 5001
CMD ["node", "server.js"]

# ==========================================
# Étape 6 : Backend + Frontend MOBILE
# ==========================================
FROM backend-base AS backend-mobile
# Copier le build mobile dans un dossier séparé
COPY --from=frontend-mobile-build /frontend/mobile-build ./mobile-dist
RUN echo "Mobile files copied to backend:" && ls -la ./mobile-dist/
EXPOSE 5002
# Utiliser un script de démarrage spécifique pour mobile
CMD ["node", "server.js"]
