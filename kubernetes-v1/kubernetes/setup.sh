#!/bin/bash

# Portability Script for WordPress & Infra on Minikube
# Automates addons, TLS, and deployment

set -e

echo "🚀 Starting portable setup for Minikube..."

# 1. Enable necessary addons
echo "📦 Enabling Ingress addon..."
minikube addons enable ingress

# 2. Generate Self-Signed TLS Certificate for *.localhost
if [ ! -f localhost.crt ]; then
    echo "🔐 Generating self-signed TLS certificate for *.localhost..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout localhost.key \
        -out localhost.crt \
        -subj "/CN=*.localhost"
fi

# 3. Create TLS secrets in required namespaces
echo "🔑 Creating TLS secrets..."
# Delete if exists to allow rotation/re-run
minikube kubectl -- delete secret localhost-tls --ignore-not-found -n default
minikube kubectl -- create secret tls localhost-tls --key localhost.key --cert localhost.crt -n default

minikube kubectl -- delete secret localhost-tls --ignore-not-found -n kubernetes-dashboard
minikube kubectl -- create secret tls localhost-tls --key localhost.key --cert localhost.crt -n kubernetes-dashboard

# 4. Apply Kubernetes manifests
echo "📄 Applying manifests..."
if [ -f secret.yaml ]; then
    minikube kubectl -- apply -f secret.yaml
else
    echo "⚠️  secret.yaml not found! Please ensure it exists with your database password."
    exit 1
fi

minikube kubectl -- apply -f app.yaml
minikube kubectl -- apply -f infra.yaml

echo "✅ Deployment applied successfully!"
echo ""
echo "👉 Important Steps to access your services:"
echo "1. Run 'minikube tunnel' in a separate terminal (requires admin/sudo)."
echo "2. Access Dashboard: https://minikube.localhost"
echo "3. Access Dockge: https://dockge.localhost"
echo "4. Retrieve WordPress URL: minikube kubectl -- logs -l app=cloudflared"
echo ""
echo "Note: For the dashboard/dockge, type 'thisisunsafe' on the browser warning page if needed."