#!/bin/bash

echo "🚀 Déploiement WMS - Architecture Robuste"
echo "=================================="

# 1. Déployer le backend sur Railway
echo "📦 Déploiement du backend sur Railway..."
cd backend
cp Dockerfile.railway Dockerfile
railway login
railway up
echo "✅ Backend déployé sur Railway"

# 2. Déployer le frontend sur Vercel
echo "🎨 Déploiement du frontend sur Vercel..."
cd ../frontend
cp ../frontend-vercel.json vercel.json
vercel --prod
echo "✅ Frontend déployé sur Vercel"

# 3. Afficher les URLs
echo ""
echo "🌐 URLs de déploiement:"
echo "Frontend: https://wms-warehouse-management.vercel.app"
echo "Backend: $(railway domain)"
echo ""
echo "🎯 Configuration terminée !"
